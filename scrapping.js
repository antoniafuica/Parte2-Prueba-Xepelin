const {google} = require('googleapis');
const puppeteer = require('puppeteer');
require('dotenv').config();

const client = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({version: 'v4', auth: client});

const scrappingBlog = async (category) => {
    console.log(`Empezando el browser con categoria: ${category}`);
    console.log(await puppeteer.executablePath());
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(`https://xepelin.com/blog/${category}`, {waitUntil: 'networkidle2'});

    console.log(`Pagina cargada con categoria: ${category}`);

    const articleLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('div.BlogArticle_box__JyD1X.BlogArticle_boxSimple__KiPW6 a.absolute.z-10.h-full.w-full').forEach(link => {
            links.push(link.href);
        });
        return links;
    });

    console.log(`Encontre ${articleLinks.length} articles`);

    const articles = [];
    for (let link of articleLinks) {
        console.log(`Navegando al link: ${link}`);
        await page.goto(link, {waitUntil: 'networkidle2'});
        const article = await page.evaluate(() => {
            const titleElement = document.querySelector('h1.ArticleSingle_title__0DNjm');
            const categoryElement = document.querySelector('a.text-primary-main.no-underline');
            const authorDiv = document.querySelector('div.text-sm.dark\\:text-text-disabled');
            const readingTimeDiv = document.querySelector('div.Text_body__snVk8.text-base');

            const title = titleElement ? titleElement.innerText : '';
            const category = categoryElement ? categoryElement.innerText : '';
            const author = authorDiv ? authorDiv.innerText : '';
            const readingTime = readingTimeDiv ? readingTimeDiv.childNodes[0]?.textContent.trim() : '';

            return { title, category, author, readingTime }; 
        });
        articles.push(article);
    }

    await browser.close();
    console.log(`Browser cerrado para categoria: ${category}`);
    return articles;
};

const saveGoogleSheet = async (data) => {  
    const request = {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'Hoja1!A2',
        valueInputOption: 'RAW',
        resource: {
            values : data.map(article => [article.title, article.category, article.author, article.readingTime]),
        },
    };
    await sheets.spreadsheets.values.append(request);
    console.log("Data agregada a Google Sheets");
};


module.exports = {
    scrappingBlog,
    saveGoogleSheet
};