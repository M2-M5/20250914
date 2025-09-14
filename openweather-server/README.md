# OpenWeather MCP Server

MCP server that exposes OpenWeather API data as tools for Model Context Protocol (MCP) compatible clients.

- Tools:
  - get_current_weather: Current conditions by city or coordinates
  - get_forecast: 5-day/3-hour forecast by city or coordinates
- Language: TypeScript
- Transport: stdio

## Requirements

- Node.js 18+ (recommended 20+) to use Fetch/Undici and NodeNext ESM
- OpenWeather API key: https://openweathermap.org/api
- An MCP-compatible client (e.g., Cline or other MCP client)

## Setup

1. Install dependencies
   cd openweather-server
   npm install

2. Configure environment

   - Create a .env file (or set env vars in your client config)
   - Required:
     OPENWEATHER_API_KEY=your_api_key_here

   You can copy from the provided .env.example.

3. Develop locally
   npm run dev

   # Ensure OPENWEATHER_API_KEY is set in your environment

4. Build
   npm run build

5. Start (stdio transport)
   npm start

The server will run over stdio which is intended to be launched by an MCP client, not directly by users.

## MCP Client Configuration

Add this server to your MCP client configuration. Example configuration snippet (adjust paths for your system):

- Command: node
- Args:
  - dist/index.js
- Working directory: the openweather-server project folder
- Environment:
  - OPENWEATHER_API_KEY set to your key

Example JSON-like configuration:

{
"mcpServers": {
"openweather": {
"command": "node",
"args": ["dist/index.js"],
"cwd": "C:\\Users\\<you>\\LocalDesktop\\20250914\\openweather-server",
"env": {
"OPENWEATHER_API_KEY": "your_api_key_here"
}
}
}
}

Alternatively, during development you may run the TypeScript entry with tsx:

{
"mcpServers": {
"openweather": {
"command": "npx",
"args": ["-y", "tsx", "watch", "src/index.ts"],
"cwd": "C:\\Users\\<you>\\LocalDesktop\\20250914\\openweather-server",
"env": {
"OPENWEATHER_API_KEY": "your_api_key_here"
}
}
}
}

## Tools

### get_current_weather

- Description: Get current weather by city name (q) or coordinates (lat, lon).
- Input schema:
  - q: string (e.g., "Toronto" or "London,uk"). If provided, lat/lon are ignored.
  - lat: number (e.g., 43.651070)
  - lon: number (e.g., -79.347015)
  - units: "standard" | "metric" | "imperial" (default "metric")
  - lang: string (e.g., "en", "fr", "es")

Examples:

- By city name:
  { "q": "Toronto", "units": "metric" }
- By coordinates:
  { "lat": 43.65107, "lon": -79.347015, "units": "imperial" }

### get_forecast

- Description: Get 5 day / 3 hour forecast by city name (q) or coordinates (lat, lon).
- Input schema:
  - q: string (e.g., "Toronto")
  - lat: number
  - lon: number
  - units: "standard" | "metric" | "imperial" (default "metric")
  - lang: string (e.g., "en")
  - limit: number (1-40) Optional; default 8 entries (~24 hours)

Example:
{ "q": "London,uk", "units": "metric", "limit": 10 }

## Environment Variables

- OPENWEATHER_API_KEY (required): Your OpenWeather API key.

## Scripts

- npm run dev: Start the server in watch mode (tsx) for development
- npm run build: Compile TypeScript to dist
- npm start: Run compiled server (dist/index.js)
- npm run typecheck: TypeScript type checking

## Notes

- The server validates that either q (city string) is provided OR both lat and lon are provided.
- Default units are metric if not specified.

## License

MIT
