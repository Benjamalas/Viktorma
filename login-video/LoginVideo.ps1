# LoginVideo.ps1
# Plays a fullscreen video at logon. Closes on the disable keybind (default Ctrl+Alt+X)
# or when the video finishes. This is a personal startup screen for your own machine.

param(
    # Path to the video to play. Defaults to intro.mp4 sitting next to this script.
    [string]$VideoPath = (Join-Path $PSScriptRoot 'intro.mp4')
)

Add-Type -AssemblyName PresentationCore, PresentationFramework, WindowsBase

if (-not (Test-Path $VideoPath)) {
    [System.Windows.MessageBox]::Show("Video not found:`n$VideoPath`n`nDrop your video file there (or edit VideoPath).", "LoginVideo") | Out-Null
    return
}

# --- Fullscreen borderless window -------------------------------------------
$window = New-Object System.Windows.Window
$window.WindowStyle   = 'None'
$window.ResizeMode    = 'NoResize'
$window.WindowState   = 'Maximized'
$window.Topmost       = $true
$window.Background    = [System.Windows.Media.Brushes]::Black
$window.Cursor        = [System.Windows.Input.Cursors]::None
$window.ShowInTaskbar = $false

# --- Video element ----------------------------------------------------------
$media = New-Object System.Windows.Controls.MediaElement
$media.LoadedBehavior   = 'Manual'
$media.UnloadedBehavior = 'Manual'
$media.Stretch          = 'Uniform'
$media.Source           = [Uri]$VideoPath
$window.Content = $media

# --- The disable keybind: Ctrl+Alt+X ---------------------------------------
# Change $DisableKey below if you want a different escape key.
$DisableKey = [System.Windows.Input.Key]::X
$window.Add_KeyDown({
    param($s, $e)
    $ctrl = [System.Windows.Input.Keyboard]::Modifiers -band [System.Windows.Input.ModifierKeys]::Control
    $alt  = [System.Windows.Input.Keyboard]::Modifiers -band [System.Windows.Input.ModifierKeys]::Alt
    if ($ctrl -and $alt -and $e.Key -eq $DisableKey) {
        $window.Close()
    }
})

# Close automatically when the clip ends.
$media.Add_MediaEnded({ $window.Close() })

# Start playback once the window is up.
$window.Add_Loaded({
    $window.Activate() | Out-Null
    $media.Play()
})

# Stop the media on the way out so the file handle is released.
$window.Add_Closed({ $media.Stop() })

$window.ShowDialog() | Out-Null
