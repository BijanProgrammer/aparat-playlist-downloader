// external imports
const path = require('path');
const puppeteer = require('puppeteer');

// local imports
const {printStep, printDivider} = require('./utils/console.utils');

// global variables
const PAGE_URL = 'https://bijanprogrammer.com';

const DOWNLOAD_FOLDER = 'downloads';

// functions

// main
const main = async () => {
    printStep('launching the browser ...');
    const browser = await puppeteer.launch();
    printStep('browser has been launched successfully!');

    printDivider();

    printStep('creating a new page and navigating to the url ...');
    const page = await browser.newPage();
    await page.goto(PAGE_URL);
    printStep('page loaded successfully!');

    printDivider();

    printStep('taking a screenshot ...');
    await page.screenshot({path: path.join(DOWNLOAD_FOLDER, 'page.png')});
    printStep('screenshot has been successfully taken!');

    printStep('closing the browser ...');
    await browser.close();
    printStep('browser has been closed successfully!');
};

main().then(() => console.log('Done!'));
