$UrlToLaunch = "http://localhost:3000/screensaver"
$ChromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$EdgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$WasConnected = $false

while ($true) {
    # Check if there is an active network profile with Internet connectivity
    $Profile = Get-NetConnectionProfile -ErrorAction SilentlyContinue
    $IsConnected = $false
    if ($Profile) {
        $IsConnected = ($Profile | Where-Object IPv4Connectivity -eq 'Internet').Count -gt 0
    }

    if ($IsConnected -and -not $WasConnected) {
        # Internet just connected! Launch the HUD in Kiosk mode.
        if (Test-Path $ChromePath) {
            Start-Process -FilePath $ChromePath -ArgumentList "--kiosk $UrlToLaunch"
        } elseif (Test-Path $EdgePath) {
            Start-Process -FilePath $EdgePath -ArgumentList "--kiosk $UrlToLaunch"
        } else {
            Start-Process -FilePath $UrlToLaunch
        }
    }

    $WasConnected = $IsConnected

    # Wait for 5 seconds before checking again
    Start-Sleep -Seconds 5
}
