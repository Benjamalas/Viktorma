# Uninstall.ps1
# Removes the LoginVideo scheduled task so it no longer runs at logon.
#   powershell -ExecutionPolicy Bypass -File .\Uninstall.ps1

$taskName = 'LoginVideo'
$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Removed. The video will no longer play at logon."
} else {
    Write-Host "Nothing to remove - '$taskName' task was not found."
}
