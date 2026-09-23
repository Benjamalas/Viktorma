# Install.ps1
# Registers LoginVideo.ps1 to run automatically at logon via a Scheduled Task.
# Run once: right-click -> "Run with PowerShell", or from a PowerShell window:
#   powershell -ExecutionPolicy Bypass -File .\Install.ps1

$ErrorActionPreference = 'Stop'

$scriptPath = Join-Path $PSScriptRoot 'LoginVideo.ps1'
if (-not (Test-Path $scriptPath)) { throw "LoginVideo.ps1 not found next to Install.ps1" }

$taskName = 'LoginVideo'

# What to run: powershell, hidden window, bypassing execution policy, pointing at LoginVideo.ps1
$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$scriptPath`""

# When: at logon of the current user
$trigger = New-ScheduledTaskTrigger -AtLogOn

# Run in the interactive session so the video actually shows on screen
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited

$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger `
    -Principal $principal -Settings $settings -Force | Out-Null

Write-Host "Installed. The video will play at your next logon."
Write-Host "Disable the video anytime while it plays with:  Ctrl + Alt + X"
Write-Host "To remove it completely, run:  .\Uninstall.ps1"
