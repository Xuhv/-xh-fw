import { FetchX } from "../src/main.ts";

const client = new FetchX({});

client.retry = 2;
client.retryInterval = 500;

// wrong host
await client.get("http://localhost:3001/network-error").catch((err) => {
  console.error("test_01", err, "\n");
});

await new Promise((r) => setTimeout(r, 3));

// 4xx/5xx is a success request, will not retry
await client.get("http://localhost:3000/fail").then(async (res) => {
  if (res.status > 400) {
    console.error("test_02", res.status, await res.json(), "\n");
  }
});

// get abort request
const { abort, promise: abortableReq } = client.getAbortable(
  'get',
  "http://localhost:3000/delay"
);

setTimeout(abort, 1500);

await abortableReq.catch((err) => {
  console.error("test_03", err, "\n");
});

// add headers
client.preRequest = (req) => {
  req.headers = [
    ["emm", "aaa"],
    ["bbb", "ccc"],
  ];
  return req;
};

await client.get("http://localhost:3000/emm").then(async (res) => {
  console.log("test_04", res.status, await res.json(), "\n");
});

// handler response
client.preResponse = (res) => res.json();

await client
  .get<Record<string, string>>("http://localhost:3000/emm")
  .then((res) => console.log("test_05", res, "\n"));

// handler error
client.preResponse = (res) => {
  if (res.ok) {
    // return Promise.reject(new Error("It succeeded, but it didn't."));    // don't retry
    return Promise.reject(new TypeError("It succeeded, but it didn't."));
  }
  return res;
};
client.postError = (err) => {
  console.error("test_06", err.message, "\n");
};

client.get("http://localhost:3000/success-or-not");
