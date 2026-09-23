# Login Video

Plays a fullscreen video every time you log in / turn on your Windows PC.
Includes a keybind to close it instantly, just in case.

## Setup

1. Put your video file in this folder and name it **`intro.mp4`**
   (or edit `VideoPath` at the top of `LoginVideo.ps1` to point elsewhere).
2. Right-click **`Install.ps1`** → **Run with PowerShell**.
   - If Windows blocks it, open PowerShell in this folder and run:
     `powershell -ExecutionPolicy Bypass -File .\Install.ps1`

That's it — the video now plays at every logon.

## The disable keybind

While the video is playing, press:

> **Ctrl + Alt + X**

The video closes immediately. Change the key by editing the `$DisableKey`
line in `LoginVideo.ps1`.

## Test it without rebooting

    powershell -ExecutionPolicy Bypass -File .\LoginVideo.ps1

## Remove it for good

Right-click **`Uninstall.ps1`** → Run with PowerShell (or run it the same way
as Install). This deletes the scheduled task; the logon video stops.

## Notes

- Uses only built-in Windows components (WPF `MediaElement`), no installs.
- The window is fullscreen and topmost, but **not** a true kiosk lock — the
  keybind, and `Uninstall.ps1`, are your ways out. Keep this folder handy.
- Playback uses your system's installed codecs. `.mp4` (H.264) works out of
  the box on Windows 10/11.
