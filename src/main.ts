export class FetchX {
  preResponse: ResponseHandler;
  preRequest: RequestHandler;
  postError: ErrorHandler;

  retry = 0;
  retryInterval = 1000;

  constructor({
    requestHandler = (req) => req,
    responseHandler = (res) => res,
    errorHandler = (err) => Promise.reject(err),
  }: FetchXInitProps) {
    this.preRequest = requestHandler;
    this.preResponse = responseHandler;
    this.postError = errorHandler;
  }

  request = async <T>(
    req: RequestInfo,
    options?: RequestInit,
    retry = this.retry
  ): Promise<T> => {
    const _req = new Request(req, await this.preRequest({}));
    return (
      fetch(_req, options)
        .then(this.preResponse)
        // retry
        .catch(async (err) => {
          if (err instanceof DOMException && err.name === "AbortError")
            return Promise.reject(err);

          if (retry > 0 && err instanceof TypeError)
            // console.log(`remain retry ${retry}/${this.retry}`);
            return await new Promise((r) =>
              setTimeout(
                () => r(this.request(req, options, retry - 1)),
                this.retryInterval
              )
            );

          return Promise.reject(err);
        })
        // postErr
        .catch(this.postError) as Promise<T>
    );
  };

  get = <T = Response>(req: RequestInfo, options?: RequestInit) =>
    this.request<T>(req, { ...options, method: "GET" });

  post = <T = Response>(req: RequestInfo, options?: RequestInit) =>
    this.request<T>(req, { ...options, method: "POST" });

  getAbortable = <T>(m: "get" | "post", ...params: FetchXRequestParams) => {
    const abortController = new AbortController();
    const abortable = this[m].bind(this);
    params[1] = { ...params[1], signal: abortController.signal };
    return {
      promise: abortable<T>(...params),
      abort: () => abortController.abort(),
    };
  };
}

type FetchXRequestParams = [req: RequestInfo, options?: RequestInit];
type ResponseHandler = (res: Response) => unknown;
type RequestHandler = (req: RequestInit) => RequestInit | Promise<RequestInit>;
type ErrorHandler = (err: Error) => unknown;

type FetchXInitProps = {
  requestHandler?: RequestHandler;
  responseHandler?: ResponseHandler;
  errorHandler?: ErrorHandler;
};
