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
function buildAuthHeader(body: any, randomString: string): string {
  const hashStr = SECRET_KEY + randomString + toPkiString(body);
  const hash = crypto.createHash("sha256").update(Buffer.from(hashStr, "utf-8")).digest("base64");
  const params = `apiKey:${API_KEY}&randomKey:${randomString}&signature:${hash}`;
  return "IYZWS " + Buffer.from(params, "utf-8").toString("base64");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function post(path: string, body: any): Promise<any> {
  const randomString = generateRandomString(8);
  const authorization = buildAuthHeader(body, randomString);

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

  return res.json();
}

export async function createCheckoutForm(request: Record<string, unknown>) {
  return post("/payment/iyzipos/checkoutform/initialize/auth/ecom", request);
}

export async function retrieveCheckoutForm(request: { locale: string; token: string }) {
  return post("/payment/iyzipos/checkoutform/auth/ecom/detail", request);
}
