const puppeteer = require('puppeteer');
const path = require('path');

async function generateScreenshots() {
  console.log('🚀 Launching browser...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport size
  await page.setViewport({
    width: 1400,
    height: 1000,
    deviceScaleFactor: 2 // High DPI for better quality
  });

  // Load the HTML file
  const htmlPath = 'file://' + path.resolve(__dirname, 'public/index.html');
  console.log('📄 Loading:', htmlPath);

  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // Wait for the app to be ready
  await page.waitForSelector('.add-task-form');
  await page.waitForTimeout(1000);

  console.log('✨ Adding sample tasks...');

  // Add sample tasks programmatically
  await page.evaluate(() => {
    // Add high priority work task
    addTodo('Complete project report', 'high', 'work');

    // Add medium priority study task
    addTodo('Learn JavaScript fundamentals', 'medium', 'study');

    // Add low priority shopping task
    addTodo('Buy groceries for the week', 'low', 'shopping');

    // Add medium priority personal task
    addTodo('Call dentist for appointment', 'medium', 'personal');

    // Add high priority work task
    addTodo('Prepare presentation for Monday', 'high', 'work');

    // Mark one task as completed
    if (todos.length > 0) {
      completeTodo(todos[0].id);
    }

    // Update UI
    updateUI();
  });

  await page.waitForTimeout(1000);

  // Take screenshot in light mode
  console.log('📸 Capturing light mode screenshot...');
  await page.screenshot({
    path: 'screenshots/web-light-mode.png',
    fullPage: false
  });
  console.log('✅ Light mode screenshot saved!');

  // Toggle dark mode
  console.log('🌙 Switching to dark mode...');
  await page.click('#themeToggle');
  await page.waitForTimeout(500);

  // Take screenshot in dark mode
  console.log('📸 Capturing dark mode screenshot...');
  await page.screenshot({
    path: 'screenshots/web-dark-mode.png',
    fullPage: false
  });
  console.log('✅ Dark mode screenshot saved!');

  await browser.close();

  console.log('\n🎉 Done! Screenshots saved to screenshots/ directory');
  console.log('   - screenshots/web-light-mode.png');
  console.log('   - screenshots/web-dark-mode.png');
}

// Run the script
generateScreenshots().catch(error => {
  console.error('❌ Error generating screenshots:', error);
  process.exit(1);
});
