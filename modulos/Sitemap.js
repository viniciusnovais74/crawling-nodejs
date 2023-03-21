/**
 * @param {String} url //Uma String com um único sitemap principal;
 * @param {Array} sitemaps_url //Um Array com varios sitemaps para rastreamento;
 * @param {String} filePath //Um caminho para o arquivo de sitemap;
 */

const puppeteer = require("puppeteer");
const { XMLParser } = require("fast-xml-parser");
const {
  SITEMAPINDEX,
  NOTFOUND,
  URLSET,
} = require("../configuration/constants");

const fileSystem = require("fs").promises;

async function StartFolder(url) {}

async function GetSitemap(url) {
  await fileSystem
    .access(url.hostname)
    .catch(async (error) => {
      if (error && error.code === "ENOENT") {
        await fileSystem.mkdir(url.hostname); //Create dir in case not found
      }
    })
    .finally(async () => {
      await fileSystem.access(url.hostname).catch(async (error) => {
        return [false, NOTFOUND, null];
      });
    });
  const browser = await puppeteer.launch();
  const webpage = await browser.newPage();

  await webpage.goto(url);

  const conteudo = await webpage.content();

  const conteudoXML = new XMLParser().parse(conteudo);

  const conteudoJSON = JSON.stringify(conteudoXML.html.body.div[0]);

  fileSystem.writeFile(url.hostname + "/sitemap.json", conteudoJSON);

  browser.close();
  return [
    true,
    await TypeSitemap(url.hostname + "/sitemap.json"),
    JSON.parse(conteudoJSON),
  ];
}

// https://google.com/sitemap.xml
async function GetSitemaps(sitemaps_url) {
  const browser = await puppeteer.launch();
  const webpage = await browser.newPage();

  for (index = 0; index < sitemaps_url.length; index++) {
    const sitemap = new URL(sitemaps_url[index]);
    await webpage.goto(sitemap);

    const conteudo = await webpage.content();

    const conteudoXML = new XMLParser().parse(conteudo);

    const conteudoJSON = JSON.stringify(conteudoXML.html.body.div[0]);

    fileSystem.access(sitemap.hostname).catch(async (error) => {
      if (error && error.code === "ENOENT") {
        await fileSystem.mkdir(`${sitemap.hostname}/sitemap${index}`); //Create dir in case not found
      }
    });

    fileSystem.writeFile(
      `${sitemap.hostname}/sitemap${index}.json`,
      conteudoJSON
    );

    console.log(
      `Baixado ${sitemap.hostname}/sitemap${index}.json ${index + 1}/${
        sitemaps_url.length
      }`
    );
  }
  browser.close();
}

async function TypeSitemap(filePath) {
  const file = JSON.parse(await fileSystem.readFile(filePath));
  if (file.sitemapindex) {
    return SITEMAPINDEX;
  } else if (file.urlset) {
    return URLSET;
  } else {
    return NOTFOUND;
  }
}

module.exports = {
  GetSitemap,
  GetSitemaps,
};
