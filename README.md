# fetch-x

a simple fetch wrapper

## usage

pipeline:
1. `FetchX.preRequest`
    ```typescript
    type RequestHandler = (req: RequestInit) => RequestInit | Promise<RequestInit>;
    ```
2. `FetchX.preResponse`
    ```typescript
    type ResponseHandler = (res: Response) => unknown;
    ```
    If you want to trigger the retry, you need to Promise.reject a `TypeError` object. A problem is wrong request instead of network error also Promise.reject a `TypeError`.
3. `FetchX.postError`
4. now, you can use the response

### sample

see [test-client.ts](./test/test-client.ts). 

You can run these scripts with [deno](https://deno.land/).

```powershell
# run server
deno run --allow-net ./test-server.ts
```
```powershell
# run client
deno run --allow-net ./test-client.ts
```
