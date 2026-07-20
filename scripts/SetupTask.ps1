$TaskName = "JARVIS_NetworkLauncher"
$ScriptPath = "$PSScriptRoot\JARVIS_NetworkLauncher.ps1"

# Create action to run the PowerShell script completely hidden
$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$ScriptPath`""

# Trigger at user logon
$Trigger = New-ScheduledTaskTrigger -AtLogOn

# Run as current user, highest privileges
$Principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Highest

# Allow on battery power
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -DontStopOnIdleEnd

try {
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Principal $Principal -Settings $Settings -Force
    Write-Host "SUCCESS: The background network monitor task has been registered!" -ForegroundColor Green
    Write-Host "It will now run silently every time you log into Windows."
    Write-Host "To start it manually right now, you can run: Start-ScheduledTask -TaskName '$TaskName'"
} catch {
    Write-Host "ERROR: Failed to register the task." -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host "Make sure you are running this PowerShell terminal as Administrator."
}
