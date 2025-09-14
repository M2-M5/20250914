# backup_repo.ps1
$timestamp = Get-Date -Format "yyyyMMdd-HHmm"
$source = "C:\Users\zhenq\localdesktop\20250914"
$destination = "C:\Users\zhenq\backups\20250914-$timestamp.zip"

Compress-Archive -Path $source -DestinationPath $destination
Write-Host "Backup created at $destination"