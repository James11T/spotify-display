import qs from "query-string";
import { HTTPError } from "./apiError";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions extends Omit<RequestInit, "method"> {
  accessToken?: string;
  body?: any;
  contentType?: "application/json" | "application/x-www-form-urlencoded";
}

const APIFetch = async <T>(
  url: string,
  method: Method = "GET",
  options: RequestOptions = {}
): Promise<T> => {
  let encodedBody: any;
  if (options.body && options.contentType) {
    if (options.contentType === "application/json") {
      encodedBody = JSON.stringify(options.body);
    } else if (options.contentType === "application/x-www-form-urlencoded") {
      encodedBody = qs.stringify(options.body);
    }
  } else if (options.body) {
    encodedBody = String(options.body);
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(options.accessToken && { Authorization: `Bearer ${options.accessToken}` }),
      ...(options.contentType && { "Content-Type": options.contentType }),
    },
    body: encodedBody,
    method,
  });
  const data = await response.json();
  if (!response.ok) throw new HTTPError(data.message, response.status);
  return data;
};

const APIGet = <T>(url: string, options?: Omit<RequestOptions, "body">) =>
  APIFetch<T>(url, "GET", options);

const APIPost = <T>(url: string, options?: RequestOptions) => APIFetch<T>(url, "POST", options);

const APIPut = <T>(url: string, options?: RequestOptions) => APIFetch<T>(url, "PUT", options);

const APIPatch = <T>(url: string, options?: RequestOptions) => APIFetch<T>(url, "PATCH", options);

const APIDelete = <T>(url: string, options?: Omit<RequestOptions, "body">) =>
  APIFetch<T>(url, "DELETE", options);

export {
  APIFetch as fetch,
  APIGet as get,
  APIPost as post,
  APIPut as put,
  APIPatch as patch,
  APIDelete as delete,
};
