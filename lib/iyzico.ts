import crypto from "node:crypto";
import https from "node:https";

const BASE_URL = process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com";
const API_KEY = process.env.IYZICO_API_KEY ?? "";
const SECRET_KEY = process.env.IYZICO_SECRET_KEY ?? "";

function generateRandomString(): string {
  return Math.random().toString(36).slice(2, 10);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPkiString(value: any): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    return "[" + value.map(toPkiString).join(", ") + "]";
  }
  if (typeof value === "object") {
    const parts = Object.entries(value)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([k, v]) => `${k}=${toPkiString(v)}`);
    return "[" + parts.join(",") + "]";
  }
  return String(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildAuthHeader(body: any, randomString: string): string {
  const hashStr = SECRET_KEY + randomString + toPkiString(body);
  const hash = crypto.createHash("sha256").update(Buffer.from(hashStr, "utf8")).digest("base64");
  const params = ["apiKey:" + API_KEY, "randomKey:" + randomString, "signature:" + hash];
  return "IYZWS " + Buffer.from(params.join("&"), "utf8").toString("base64");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function httpsPost(path: string, body: any, authorization: string, randomString: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(`${BASE_URL}${path}`);
    const bodyStr = JSON.stringify(body);
    const contentLength = Buffer.byteLength(bodyStr, "utf8");

    const req = https.request(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname,
        method: "POST",
        headers: {
          Authorization: authorization,
          "x-iyzi-rnd": randomString,
          "x-iyzi-client-version": "iyzipay-node-2.1.49",
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Content-Length": contentLength,
        },
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          try { resolve(JSON.parse(data)); }
          catch { reject(new Error(`Invalid JSON: ${data}`)); }
        });
      }
    );

    req.on("error", reject);
    req.write(bodyStr);
    req.end();
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function post(path: string, body: any): Promise<any> {
  const randomString = generateRandomString();
  const authorization = buildAuthHeader(body, randomString);
  return httpsPost(path, body, authorization, randomString);
}

export async function createCheckoutForm(request: Record<string, unknown>) {
  return post("/payment/iyzipos/checkoutform/initialize/auth/ecom", request);
}

export async function retrieveCheckoutForm(request: { locale: string; token: string }) {
  return post("/payment/iyzipos/checkoutform/auth/ecom/detail", request);
}
