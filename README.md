# Y2K Desktop

An original, browser-based 1999 personal computer. HTML5, CSS3 and vanilla JavaScript; no dependencies, build step, backend, network calls, or proprietary artwork.

## Preview

Open `index.html` in a browser, or serve the project for consistent localStorage behavior:

```sh
cd y2k-desktop
python3 -m http.server 8000
```

Visit http://localhost:8000. The server is only a development convenience; the application itself needs no backend.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the **contents** of this folder (`index.html`, `css`, `js`, and this README) to its root.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your `main` branch and `/ (root)`, then **Save**.
5. Once GitHub finishes deployment, open the URL shown on the Pages settings screen, typically `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

All asset paths are relative, so repository subpaths work. No npm install or build command is needed. If using the whole workspace as the repository, visit the `/y2k-desktop/` subdirectory of its Pages URL instead.

## Using the desktop

- Single-click icons to select; double-click or press Enter to open.
- Drag title bars to move windows; double-click them to maximize or restore.
- Window controls minimize, maximize/restore and close. Resize normal windows with the bottom-right browser resize handle.
- Taskbar buttons minimize the focused window or restore/focus other windows.
- Programs opens application shortcuts. Right-click the desktop for Refresh and Properties.
- My Computer provides fictional drives and folders, Back/Up navigation, and text files that open in Notepad. Select items with a click; open with double-click or Enter.
- Notepad's File menu supports New, Open, Save, Save As and Close. Save As asks before overwriting a different document. Unsaved edits trigger a discard/cancel prompt on New, Open or Close.
- Control Panel persists background color and desktop label visibility. Apply saves without closing; Cancel dismisses pending choices.

Keyboard: Escape dismisses menus and child dialogs, arrows navigate desktop icons/menus, Alt+F4 closes the active window, Alt+F9 minimizes, Alt+F10 maximizes/restores. Notepad supports Ctrl/Cmd+N, O and S. The browser or operating system may reserve some shortcuts.

## Persistence and limitations

Settings, first-run state, and saved Notepad documents use namespaced localStorage keys (`y2k.settings`, `y2k.visited`, `y2k.documents`). They belong to the current browser and origin. Clearing site data removes them; private browsing or full storage can prevent saving and the interface reports that failure. Documents do not synchronize between devices or download to disk. Export valuable text by copying it to a local file. Fictional drives are read-only. Window positions and open apps are session-only. This is a desktop-oriented experience; smaller viewports constrain window dimensions and provide content scrolling.

## Architecture

- `js/icons.js`: original pixel SVG artwork and shared namespace.
- `js/storage.js`: persistence and validated preferences.
- `js/window-manager.js`: lifecycle, focus/stacking, taskbar, dragging, sizing and window controls.
- `js/apps.js`: application registry, fictional filesystem, Notepad, display properties, shared dialogs and About.
- `js/desktop.js`: desktop icons, Programs/context menus, keyboard commands and clock.
- `css/desktop.css`: classic bevels, compact controls, desktop and app layouts.

To add an application, push an `{ id, title, icon, open }` entry to `Y2K.apps` before `desktop.js` runs. `open()` can call `Y2K.wm.create({ title, icon, width, height, render(win), onClose })`; populate `win.content` and use `win.setTitle()` for title changes. Return false from `onClose` to defer closure, then call `Y2K.wm.close(win, true)` after resolving it. Set `owner` on child dialogs so they close with their parent. This shared shell supports future browsers, media players, Paint, games and screensavers.

All branding, pixel artwork and fictional files are original. Y2K Desktop is not affiliated with any historical operating system vendor.
