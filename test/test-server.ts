import { serve } from "https://deno.land/std@0.141.0/http/server.ts";

async function handler(req: Request): Promise<Response> {
  if (req.url === "http://localhost:3000/fail") {
    console.error(req.url, 404);
    const body = JSON.stringify({ message: "NOT FOUND" });
    return new Response(body, {
      status: 404,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  if (req.url === "http://localhost:3000/delay") {
    await new Promise((r) => setTimeout(r, 5000));
    return new Response("OK");
  }

  console.info(req.url, 200);
  return new Response(
    JSON.stringify(Object.fromEntries(Array.from(req.headers.entries()))),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    }
  );
}

serve(handler, { port: 3000 });
