import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  if (!process.env.OPENWEATHER_API_KEY) {
    throw new Error("OPENWEATHER_API_KEY is not set in the environment for this run.");
  }

  const client = new Client({
    name: "openweather-runner",
    version: "0.1.0",
  });

  // This launches a fresh instance of the server (dist/index.js) via stdio
  // The env var OPENWEATHER_API_KEY must be present so the server can call OpenWeather
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
    env: { OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY! }
  });

  try {
    await client.connect(transport);

    const result = await client.callTool({
      name: "get_current_weather",
      arguments: { q: "Toronto", units: "metric" },
    });

    // Print the text content returned by the tool (or the raw result if not text)
    const first = result?.content?.[0] as any;
    const output =
      first?.type === "text" && typeof first?.text === "string"
        ? first.text
        : JSON.stringify(result, null, 2);

    console.log(output);
  } finally {
    try {
      await (client as any).close?.();
    } catch {}
    try {
      (transport as any).close?.();
    } catch {}
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
