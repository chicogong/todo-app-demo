# Screenshot Generation Guide

This project includes an automated screenshot generation script using Puppeteer.

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Generate screenshots
npm run screenshot
```

This will create two screenshots in the `screenshots/` directory:
- `web-light-mode.png` - Light theme
- `web-dark-mode.png` - Dark theme

## What the Script Does

The `generate-screenshots.js` script:
1. Launches a headless Chrome browser
2. Opens `public/index.html`
3. Adds sample tasks with different priorities and categories
4. Takes a screenshot in light mode
5. Toggles to dark mode
6. Takes a screenshot in dark mode
7. Saves both screenshots to `screenshots/`

## Requirements

- Node.js (v14 or higher)
- The script will automatically download Chromium when you install Puppeteer

## Troubleshooting

### Missing System Libraries

On Linux, you might need to install additional libraries:

**Debian/Ubuntu:**
```bash
sudo apt-get update
sudo apt-get install -y \
  libgbm1 \
  libasound2 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libpango-1.0-0 \
  libcairo2
```

**RHEL/CentOS/Fedora:**
```bash
sudo yum install -y \
  alsa-lib \
  atk \
  cups-libs \
  gtk3 \
  libXcomposite \
  libXdamage \
  libXrandr \
  pango
```

### Alternative: Manual Screenshots

If the automated script doesn't work in your environment, you can generate screenshots manually:

1. Open `public/index.html` in your browser
2. Add some sample tasks
3. Take a full-page screenshot (save as `screenshots/web-light-mode.png`)
4. Click the theme toggle button (🌙)
5. Take another screenshot (save as `screenshots/web-dark-mode.png`)

## Custom Screenshots

You can modify `generate-screenshots.js` to:
- Change viewport size (line 12-15)
- Add different sample tasks (line 33-54)
- Adjust screenshot settings (line 64 and 74)
- Add more screenshots (different states, mobile view, etc.)

## Example Customization

```javascript
// Change viewport to mobile size
await page.setViewport({
  width: 375,
  height: 812,
  deviceScaleFactor: 2
});

// Add custom tasks
await page.evaluate(() => {
  addTodo('Your custom task', 'high', 'work');
  updateUI();
});
```

## GitHub Actions Integration

You can also set up automated screenshot generation in GitHub Actions:

```yaml
name: Generate Screenshots
on:
  push:
    branches: [main]

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run screenshot
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'Update screenshots'
          file_pattern: screenshots/*.png
```

This will automatically regenerate screenshots whenever you push changes.
