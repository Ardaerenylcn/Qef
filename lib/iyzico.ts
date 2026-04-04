import crypto from "crypto";

const BASE_URL = process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com";
const API_KEY = process.env.IYZICO_API_KEY ?? "";
const SECRET_KEY = process.env.IYZICO_SECRET_KEY ?? "";

function generateRandomString(length = 8): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
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
function buildAuthHeaderV1(body: any, randomString: string): string {
  const hashStr = SECRET_KEY + randomString + toPkiString(body);
  const hash = crypto.createHash("sha256").update(Buffer.from(hashStr, "utf-8")).digest("base64");
  const params = `apiKey:${API_KEY}&randomKey:${randomString}&signature:${hash}`;
  return "IYZWS " + Buffer.from(params, "utf-8").toString("base64");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildAuthHeaderV2(body: any, randomString: string): string {
  const hashStr = randomString + JSON.stringify(body);
  const hash = crypto.createHmac("sha256", SECRET_KEY).update(Buffer.from(hashStr, "utf-8")).digest("base64");
  const params = `apiKey:${API_KEY}&randomKey:${randomString}&signature:${hash}`;
  return "IYZWSv2 " + Buffer.from(params, "utf-8").toString("base64");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function post(path: string, body: any, version: "v1" | "v2" = "v1"): Promise<{ result: any; debug: Record<string, string> }> {
  const randomString = generateRandomString(8);
  const pkiStr = toPkiString(body);
  const authorization = version === "v2" ? buildAuthHeaderV2(body, randomString) : buildAuthHeaderV1(body, randomString);
  const prefix = version === "v2" ? "IYZWSv2 " : "IYZWS ";
  const decodedAuth = Buffer.from(authorization.replace(prefix, ""), "base64").toString("utf-8");

  const debug = {
    authVersion: version,
    apiKeySet: API_KEY ? `yes (${API_KEY.slice(0, 8)}...)` : "EMPTY",
    secretKeySet: SECRET_KEY ? `yes (${SECRET_KEY.slice(0, 8)}...)` : "EMPTY",
    randomString,
    pkiStr: pkiStr.slice(0, 200),
    decodedAuth: decodedAuth.slice(0, 200),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
      "x-iyzi-rnd": randomString,
      "x-iyzi-client-version": "iyzipay-node-2.1.49",
    },
    body: JSON.stringify(body),
  });

  const result = await res.json();
  return { result, debug };
}

export async function createCheckoutFormDebug(request: Record<string, unknown>) {
  return post("/payment/iyzipos/checkoutform/initialize/auth/ecom", request, "v2");
}

export async function createCheckoutForm(request: Record<string, unknown>) {
  const { result } = await post("/payment/iyzipos/checkoutform/initialize/auth/ecom", request, "v2");
  return result;
}

export async function retrieveCheckoutForm(request: { locale: string; token: string }) {
  const { result } = await post("/payment/iyzipos/checkoutform/auth/ecom/detail", request, "v2");
  return result;
}

export async function testAuth() {
  return post("/payment/test", { locale: "tr" }, "v1");
}
