const puppeteer = require("puppeteer");
const XMLParser = require("fast-xml-parser");
const { SITEMAPINDEX, NOTFOUND, URLSET } = require("../configuration/constants");
const fileSystem = require("fs").promises;

async function StartFolder(url) {}

async function ReadFileSitemap(filePath){

}

async function DownloadPagePos(url,filePath){
    const browser = await puppeteer.launch();
    const webpage = await browser.newPage();

    await webpage.goto(url);

    const conteudo = await webpage.evaluate(() => document);
    console.log(conteudo)
    
}

async function DownloadPageBefore(hosty, filePath){
    const url = new URL(hosty);
    const browser = await puppeteer.launch();
    const webpage = browser.newPage();

    await webpage.goto(url);

    const conteudo = await webpage.content();

    fileSystem.writeFile(filePath+url)
}