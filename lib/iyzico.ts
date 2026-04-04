import crypto from "node:crypto";
import https from "node:https";

const BASE_URL = process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com";
const API_KEY = process.env.IYZICO_API_KEY ?? "";
const SECRET_KEY = process.env.IYZICO_SECRET_KEY ?? "";

function generateRandomString(): string {
  return process.hrtime()[0] + Math.random().toString(8).slice(2);
}

function formatPrice(price: string | number | undefined): string | undefined {
  if (typeof price !== "number" && typeof price !== "string") return undefined;
  if (!isFinite(Number(price))) return undefined;
  const result = parseFloat(String(price)).toString();
  return result.indexOf(".") === -1 ? result + ".0" : result;
}

// Authorization header — exact replication of iyzipay utils.generateHashV2
// message = randomString + path + JSON.stringify(body), digest = hex (not base64)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildAuthHeader(path: string, body: any, randomString: string): string {
  const message = randomString + path + JSON.stringify(body);
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(message).digest("hex");
  const params = ["apiKey:" + API_KEY, "randomKey:" + randomString, "signature:" + signature];
  return "IYZWSv2 " + Buffer.from(params.join("&")).toString("base64");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function httpsPost(path: string, body: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const randomString = generateRandomString();
    const authorization = buildAuthHeader(path, body, randomString);
    const bodyStr = JSON.stringify(body);
    const contentLength = Buffer.byteLength(bodyStr, "utf8");

    const req = https.request(
      {
        hostname: new URL(BASE_URL).hostname,
        port: 443,
        path,
        method: "POST",
        headers: {
          Authorization: authorization,
          "x-iyzi-rnd": randomString,
          "x-iyzi-client-version": "iyzipay-node-2.0.67",
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

// Build checkout body in exact iyzipay field order (CreateCheckoutFormInitializeRequest + models)
export interface CheckoutFormRequest {
  locale: string;
  conversationId: string;
  price: string;
  basketId: string;
  paymentGroup: string;
  buyer: {
    id: string; name: string; surname: string; identityNumber: string;
    email: string; gsmNumber: string; registrationAddress: string;
    city: string; country: string; ip: string;
  };
  shippingAddress: { address: string; contactName: string; city: string; country: string };
  billingAddress: { address: string; contactName: string; city: string; country: string };
  basketItems: Array<{ id: string; price: string; name: string; category1: string; itemType: string }>;
  callbackUrl: string;
  currency: string;
  paidPrice: string;
  enabledInstallments: number[];
}

function buildCheckoutBody(req: CheckoutFormRequest) {
  return {
    locale: req.locale,
    conversationId: req.conversationId,
    price: formatPrice(req.price),
    basketId: req.basketId,
    paymentGroup: req.paymentGroup,
    buyer: {
      id: req.buyer.id,
      name: req.buyer.name,
      surname: req.buyer.surname,
      identityNumber: req.buyer.identityNumber,
      email: req.buyer.email,
      gsmNumber: req.buyer.gsmNumber,
      registrationAddress: req.buyer.registrationAddress,
      city: req.buyer.city,
      country: req.buyer.country,
      ip: req.buyer.ip,
    },
    shippingAddress: {
      address: req.shippingAddress.address,
      contactName: req.shippingAddress.contactName,
      city: req.shippingAddress.city,
      country: req.shippingAddress.country,
    },
    billingAddress: {
      address: req.billingAddress.address,
      contactName: req.billingAddress.contactName,
      city: req.billingAddress.city,
      country: req.billingAddress.country,
    },
    basketItems: req.basketItems.map((item) => ({
      id: item.id,
      price: formatPrice(item.price),
      name: item.name,
      category1: item.category1,
      itemType: item.itemType,
    })),
    callbackUrl: req.callbackUrl,
    currency: req.currency,
    paidPrice: formatPrice(req.paidPrice),
    enabledInstallments: req.enabledInstallments,
  };
}

export async function createCheckoutForm(req: CheckoutFormRequest) {
  const path = "/payment/iyzipos/checkoutform/initialize/auth/ecom";
  const body = buildCheckoutBody(req);
  return httpsPost(path, body);
}

export async function retrieveCheckoutForm(request: { locale: string; token: string }) {
  const path = "/payment/iyzipos/checkoutform/auth/ecom/detail";
  // RetrieveCheckoutFormRequest just passes locale + token as-is
  const body = { locale: request.locale, token: request.token };
  return httpsPost(path, body);
}
