import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// OpenWeather base URL
const OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";

// Ensure API key is present
function getApiKey(): string {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    throw new Error(
      "Missing OPENWEATHER_API_KEY environment variable. Set it before launching the server."
    );
  }
  return key;
}

type Units = "standard" | "metric" | "imperial";

interface WeatherArgs {
  q?: string; // City name, e.g., "Toronto" or "London,uk"
  lat?: number; // Latitude
  lon?: number; // Longitude
  units?: Units; // Units of measurement
  lang?: string; // Language code, e.g., "en", "fr"
  limit?: number; // For forecast tool only, optional number of entries to return
}

function buildQueryParams(args: WeatherArgs, apiKey: string): URLSearchParams {
  const params = new URLSearchParams();
  params.set("appid", apiKey);

  if (args.q && args.q.trim().length > 0) {
    params.set("q", args.q.trim());
  } else if (
    typeof args.lat === "number" &&
    !Number.isNaN(args.lat) &&
    typeof args.lon === "number" &&
    !Number.isNaN(args.lon)
  ) {
    params.set("lat", String(args.lat));
    params.set("lon", String(args.lon));
  } else {
    throw new Error("Provide either 'q' (city name) or both 'lat' and 'lon'.");
  }

  if (args.units) {
    params.set("units", args.units);
  } else {
    // default to metric if not provided
    params.set("units", "metric");
  }

  if (args.lang) {
    params.set("lang", args.lang);
  }

  return params;
}

async function httpGetJson<T>(url: string): Promise<T> {
  const { fetch } = await import("undici");
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `OpenWeather request failed: ${res.status} ${res.statusText} - ${body || "no body"}`
    );
  }
  return (await res.json()) as T;
}

// Create MCP server
const server = new McpServer({
  name: "openweather-server",
  version: "0.1.0",
});

// Tool: get_current_weather
server.registerTool(
  "get_current_weather",
  {
    description:
      "Get current weather by city name (q) or coordinates (lat, lon). Units supported: standard, metric, imperial.",
    inputSchema: {
      q: z.string().describe("City name (e.g., 'Toronto' or 'London,uk'). If provided, lat/lon are ignored.").optional(),
      lat: z.number().describe("Latitude (e.g., 43.651070)").optional(),
      lon: z.number().describe("Longitude (e.g., -79.347015)").optional(),
      units: z.enum(["standard", "metric", "imperial"]).describe("Units of measurement. Default is metric.").optional(),
      lang: z.string().describe("Language code for weather description (e.g., 'en', 'fr', 'es').").optional()
    },
  },
  async (args: WeatherArgs) => {
    const apiKey = getApiKey();
    const params = buildQueryParams(args, apiKey);
    const url = `${OPENWEATHER_BASE}/weather?${params.toString()}`;

    type WeatherResponse = any;
    const data = await httpGetJson<WeatherResponse>(url);

    const summary = {
      location: data?.name,
      coordinates: data?.coord,
      weather: data?.weather?.[0],
      temperature: data?.main?.temp,
      feels_like: data?.main?.feels_like,
      humidity: data?.main?.humidity,
      pressure: data?.main?.pressure,
      visibility: data?.visibility,
      wind: data?.wind,
      clouds: data?.clouds,
      sunrise_utc: data?.sys?.sunrise,
      sunset_utc: data?.sys?.sunset,
      observation_time_utc: data?.dt,
      unit_system: params.get("units"),
      source: "https://openweathermap.org/current",
    };

    const text = JSON.stringify(
      {
        query: Object.fromEntries(params.entries()),
        summary,
        raw: data,
      },
      null,
      2
    );

    return {
      content: [{ type: "text", text }],
    };
  }
);

// Tool: get_forecast
server.registerTool(
  "get_forecast",
  {
    description:
      "Get 5 day / 3 hour forecast by city name (q) or coordinates (lat, lon). Units supported: standard, metric, imperial.",
    inputSchema: {
      q: z.string().describe("City name (e.g., 'Toronto' or 'London,uk'). If provided, lat/lon are ignored.").optional(),
      lat: z.number().describe("Latitude (e.g., 43.651070)").optional(),
      lon: z.number().describe("Longitude (e.g., -79.347015)").optional(),
      units: z.enum(["standard", "metric", "imperial"]).describe("Units of measurement. Default is metric.").optional(),
      lang: z.string().describe("Language code for weather description (e.g., 'en', 'fr', 'es').").optional(),
      limit: z.number().min(1).max(40).describe("Optional: Limit number of forecast entries returned (default 8 ≈ next 24h).").optional()
    },
  },
  async (args: WeatherArgs) => {
    const apiKey = getApiKey();
    const params = buildQueryParams(args, apiKey);
    const url = `${OPENWEATHER_BASE}/forecast?${params.toString()}`;

    type ForecastResponse = any;
    const data = await httpGetJson<ForecastResponse>(url);

    const limit = typeof args.limit === "number" ? args.limit : 8;
    const entries = Array.isArray(data?.list) ? data.list : [];
    const trimmed = entries.slice(0, limit).map((it: any) => ({
      time_utc: it?.dt,
      temp: it?.main?.temp,
      feels_like: it?.main?.feels_like,
      humidity: it?.main?.humidity,
      pressure: it?.main?.pressure,
      weather: it?.weather?.[0],
      wind: it?.wind,
      clouds: it?.clouds,
    }));

    const text = JSON.stringify(
      {
        city: data?.city,
        count: trimmed.length,
        entries: trimmed,
        unit_system: params.get("units"),
        note: "Times are in UTC (Unix seconds).",
        source: "https://openweathermap.org/forecast5",
      },
      null,
      2
    );

    return {
      content: [{ type: "text", text }],
    };
  }
);

// Connect over stdio
await server.connect(new StdioServerTransport());
