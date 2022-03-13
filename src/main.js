// integrated imports
const fs = require('fs/promises');
const path = require('path');

// external imports
require('dotenv').config({path: '../.env'});
const puppeteer = require('puppeteer-core');

// local imports
const {printStep, printDivider} = require('./utils/console.utils');

// global variables
// - env
const {PAGE_URL, OUTPUT_FOLDER} = process.env;

// - puppeteer
let BROWSER;
let PAGE;

// - aparat
const APARAT_BASE_VIDEO_URL = 'https://aparat.com';

// - files & folders
const JSON_OUTPUT_FILE_PATH = path.join(OUTPUT_FOLDER, 'links.json');
const HTML_OUTPUT_FILE_PATH = path.join(OUTPUT_FOLDER, 'links.html');

// functions
const launchTheBrowser = async () => {
    printStep('launching the browser ...');
    BROWSER = await puppeteer.launch();
    printStep('browser has been launched successfully!');
};

const createThePage = async () => {
    printStep('creating a new page ...');
    PAGE = await BROWSER.newPage();
    printStep('page created successfully!');
};

const navigate = async (url) => {
    printStep(`navigating to ${url} ...`);
    await PAGE.goto(url);
    printStep('url loaded successfully!');
};

const extractVideosMetadata = async () => {
    printStep('extracting video links ...');

    const links = await PAGE.evaluate(() =>
        [...document.querySelectorAll('h2.title a')].map((x) => x.getAttribute('href'))
    );

    printStep(`found ${links.length} links!`);

    printStep('downloading videos ...');

    const metadata = [];
    const promises = links.map((link) => extractVideoMetadata(link, metadata));
    await Promise.allSettled(promises);

    printStep('videos has been downloaded successfully ...');

    return metadata;
};

const extractVideoMetadata = async (link, output) => {
    const page = await BROWSER.newPage();
    await page.goto(APARAT_BASE_VIDEO_URL + link);

    let element = await page.waitForSelector('h1');
    const name = await page.evaluate((element) => element.textContent, element);

    element = await page.waitForSelector('[aria-label="download"]');
    await page.evaluate((element) => element.click(), element);

    element = await page.waitForSelector('[id="720p"]');
    const downloadLink = await page.evaluate((element) => element.getAttribute('href'), element);

    const id = downloadLink.match(/.+\/aparat-video\/(.+)-720p\.mp4.+/)[1];

    output.push({id, name, downloadLink});

    printStep(`metadata of "${name}" extracted successfully`);
};

const saveMetadata = async (metadata) => {
    await fs.writeFile(JSON_OUTPUT_FILE_PATH, JSON.stringify(metadata), {encoding: 'utf-8'});
    await fs.writeFile(HTML_OUTPUT_FILE_PATH, generateHtml(metadata), {encoding: 'utf-8'});
};

const generateHtml = (metadata) => {
    const anchors = metadata.map((x) => `<a href="${x.downloadLink}" download="${x.name}.mp4">${x.name}</a>`);
    return `
			<html lang="fa">
				<head>
					<meta charset="UTF-8">
					<title>Links</title>
				</head>
				<body>
					${anchors.join('<br />')}
				</body>
			</html>`;
};

const closeTheBrowser = async () => {
    printStep('closing the browser ...');
    await BROWSER.close();
    printStep('browser has been closed successfully!');
};

const waitForSeconds = async (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// main
const main = async () => {
    try {
        await launchTheBrowser();

        printDivider();

        await createThePage();
        await navigate(PAGE_URL);
        await waitForSeconds(1000);

        printDivider();

        const metadata = await extractVideosMetadata();
        await saveMetadata(metadata);

        printDivider();
    } catch (e) {
        console.error(e);
    } finally {
        await closeTheBrowser();
    }
};

main().then(() => console.info('Done!'));
