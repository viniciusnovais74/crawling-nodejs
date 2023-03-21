const { kill, exit } = require("process");
const { SITEMAPINDEX, URLSET, NOTFOUND } = require("./configuration/constants");
const { GetSitemap, GetSitemaps } = require("./modulos/Sitemap");

/**
 * @param {number} step // O passo que o programa está
 */
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
let step_information;
let url_information = null;
let crawling_html = false;

function input(prompt) {
  return new Promise((callbackFn, errorFn) => {
    readline.question(
      prompt,
      (uinput) => {
        callbackFn(uinput);
      },
      () => {
        errorFn();
      }
    );
  });
}

function Main() {
  function screenInformation() {
    readline.write(
      `========================\n========================\n    Welcome   \n========================\n========================\n  Information URL: ${url_information}\n  HTML index: ${crawling_html}\n`
    );
    input("Bem vindo para comecar a configurar pressione Enter").then(
      (uinput) => {
        if (uinput == "") {
          step_information = 1;
          Main();
        }
      }
    );
  }

  async function questions() {
    url_information = new URL(
      await input("Digite a URL do sitemap desejado: ")
    );
    crawling_html = await input("Deseja indexar o html?: ");
    step_information = 2;
    Main();
  }

  switch (step_information) {
    case 1:
      questions();
      break;
    case 2:
      Indexation();
      break;

    default:
      screenInformation();
      break;
  }
}

async function questionDownload(type) {
  const message = type == SITEMAPINDEX ? "Sitemaps" : "URLs";
  const checking =
    (await input(
      `Você possui varios ${message}, deseja baixar todo o conteudo? (S/N)\n`
    )) == "S"
      ? true
      : false;
  const download =
    (await input(
      "Deseja baixar antes ou pós processamento JavaScript? (A/P)\n"
    )) == "A"
      ? true
      : false;

  return [checking, download];
}
async function Indexation() {
  const [boolean, type, json_array] = await GetSitemap(url_information);
  const sitemaps_url = json_array.sitemapindex.sitemap.map((url) => url.loc);
  if (boolean) {
    switch (type) {
      case SITEMAPINDEX:
        await GetSitemaps(sitemaps_url);
        const [conteudo, javascript] = await questionDownload(type);
        if (!conteudo) {
          console.log("Nao foi possivel baixar o conteudo");
          readline.close();
          exit();
        } else {
          console.log("Baixando o conteudo");
          
        }
        break;
      case URLSET:
        console.log("Sitemaps");
        break;
      case NOTFOUND:
        console.log("Nao encontrado");
      default:
        console.log("Erro");
        break;
    }
  }
}

Main();
