# backup_repo.ps1
$timestamp = Get-Date -Format "yyyyMMdd-HHmm"
$source = "C:\Users\zhenq\localdesktop\20250914"
$destination = "C:\Users\zhenq\backups\20250914-$timestamp.zip"

Compress-Archive -Path $source -DestinationPath $destination
Write-Host "Backup created at $destination" { // mcp-manifest.json
    {
        "name": "openweather-server",
        "description": "Fetches current weather data using OpenWeather API",
        "version": "1.0.0",
        "endpoints": {
            "get_current_weather": {
                "input": {
                    "q": "string",
                    "units": "string"
                },
                "output": {
                    "temperature": "number",
                    "description": "string",
                    "location": "string"
                }
            }
        }
    } }