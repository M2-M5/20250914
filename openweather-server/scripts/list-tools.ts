import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const client = new Client({
    name: "openweather-test-client",
    version: "0.1.0",
  });

  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
  });

  try {
    await client.connect(transport);

    // List tools exposed by the server
    const tools = await client.listTools();
    console.log("Tools available:");
    for (const t of tools.tools ?? []) {
      console.log(`- ${t.name}${t.description ? `: ${t.description}` : ""}`);
    }
  } finally {
    try {
      await client.close();
    } catch {
      // ignore
    }
    try {
      transport.close();
    } catch {
      // ignore
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
