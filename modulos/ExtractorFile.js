/**
 * @param {string} url 
 */
function ExtractFile(url){

}

export default ExtractFile

async function DownloadPages(url, Write) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto(url);
  
    const content = await page.content();
    Write(content);
    browser.close();
  }
  
  async function CheckSitemap(url) {
    sitemap_json = JSON.parse(await fs.readFile(url.hostname + "/sitemap.json"));
    let arquivo_sitemap;
    if (sitemap_json.sitemapindex) {
      console.log("Registro longo rastrear outros index xml");
  
      const sitemaps = sitemap_json.sitemapindex.sitemap;
  
      let arrayURLS = new Array();
  
      for (i = 0; i < sitemaps.length; i++) arrayURLS.push(sitemaps[i].loc);
  
      if (EachGetSitemap(arrayURLS, url)) {
        console.log("Download dos sitemaps concluidos");
      }
  
      for (num = 0; num < arrayURLS.length; num++) {
        fs.access(`${url.hostname}/sitemap${num}`).catch(async (err) => {
          if (err && err.code === "ENOENT") {
            await fs.mkdir(`${url.hostname}/sitemap${num}`); //Create dir in case not found
          }
        });
      }
  
      arquivo_sitemap = JSON.parse(await fs.readFile)
      if (file_sitemap?.urlset) {
        const urlsets = file_sitemap.urlset.url;
  
        for (page = 0; page < urlsets.length; page++) {
          const urlSki = new URL(urlsets[page].loc);
          async function Write(content) {
            await fs.writeFile(
              `${url.hostname}/sitemap${page}/${urlSki.pathname}.html`,
              content
            );
          }
          await DownloadPages(urlsets[page].loc, Write);
        }
      }
    }
  }]


  async function 