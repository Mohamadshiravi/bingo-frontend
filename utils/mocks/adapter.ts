import {
  AxiosError,
  AxiosHeaders,
  CanceledError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccountPreview } from "../../data/accounts";
import { calculatePromotionEstimate } from "../../data/promotions";
import type { SocialNetwork } from "../../data/contracts";

export const MOCK_RESPONSE_DELAY_MS = 250;

function response(config: InternalAxiosRequestConfig, data: unknown, status = 200): AxiosResponse {
  return {
    data,
    status,
    statusText: status === 200 ? "OK" : status === 404 ? "Not Found" : "Bad Request",
    headers: new AxiosHeaders({ "Content-Type": "application/json" }),
    config,
  };
}

function requestError(config: InternalAxiosRequestConfig, message: string, status = 400): AxiosError {
  return new AxiosError(
    message,
    AxiosError.ERR_BAD_REQUEST,
    config,
    undefined,
    response(config, { message }, status),
  );
}

/** Axios transforms ordinary POST bodies to JSON before invoking an adapter. */
function parseBody(config: InternalAxiosRequestConfig): Record<string, unknown> {
  let body: unknown = config.data;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      throw requestError(config, "Request body must contain valid JSON");
    }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw requestError(config, "Request body must be a JSON object");
  }
  return body as Record<string, unknown>;
}

function parseNetwork(config: InternalAxiosRequestConfig, network: unknown): SocialNetwork {
  if (network !== "instagram" && network !== "youtube") {
    throw requestError(config, "Unsupported demo network");
  }
  return network;
}

function waitForResponse(config: InternalAxiosRequestConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    const signal = config.signal;
    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener?.("abort", cancel);
    };
    const cancel = () => {
      cleanup();
      const error = new CanceledError("canceled");
      error.config = config;
      reject(error);
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, MOCK_RESPONSE_DELAY_MS);
    if (signal?.aborted) {
      cancel();
      return;
    }
    signal?.addEventListener?.("abort", cancel, { once: true });
  });
}

/** Local-only transport: no HTTP adapter, fetch, or backend fallback. */
export const mockAdapter: AxiosAdapter = async (config) => {
  await waitForResponse(config);

  // Ignore the origin/baseURL; route only the requested endpoint path.
  const path = (config.url ?? "")
    .replace(/^(?:[a-z][a-z\d+.-]*:)?\/\/[^/]+/i, "")
    .split(/[?#]/, 1)[0]
    .replace(/^\/+|\/+$/g, "");
  if (
    config.method?.toLowerCase() !== "post" ||
    (path !== "public/account-preview" && path !== "public/promotions/estimate")
  ) {
    throw requestError(config, `No local mock for ${config.method?.toUpperCase()} ${path}`, 404);
  }

  const body = parseBody(config);
  const network = parseNetwork(config, body.network);
  if (path === "public/account-preview") {
    if (typeof body.handle !== "string") {
      throw requestError(config, "A username is required");
    }
    try {
      return response(config, getAccountPreview({ network, handle: body.handle }));
    } catch (error) {
      if (!(error instanceof TypeError || error instanceof RangeError)) throw error;
      throw requestError(config, error.message);
    }
  }

  if (typeof body.audience_size !== "number" || !Number.isFinite(body.audience_size)) {
    throw requestError(config, "audience_size must be a finite number");
  }
  if (body.goal !== undefined && body.goal !== "smart") {
    throw requestError(config, "Unsupported promotion goal");
  }
  if (body.country !== undefined && typeof body.country !== "string") {
    throw requestError(config, "country must be a string");
  }
  return response(config, calculatePromotionEstimate({
    network,
    audience_size: body.audience_size,
    goal: body.goal,
    country: body.country,
  }));
};