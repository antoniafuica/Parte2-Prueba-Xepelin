const axios = require('axios');
const cheerio = require('cheerio');
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
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(`https://xepelin.com/blog/${category}`, {waitUntil: 'networkidle2'});

    const articleLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('div.BlogArticle_box__JyD1X.BlogArticle_boxSimple__KiPW6 a.absolute.z-10.h-full.w-full').forEach(link => {
            links.push(link.href);
        });
        return links;
    });

    const articles = [];
    for (let link of articleLinks) {
        await page.goto(link, {waitUntil: 'networkidle2'});
        const article = await page.evaluate(() => {
            const title = document.querySelector('h1.ArticleSingle_title__0DNjm')?.innerText || '';
            const category = document.querySelector('a.text-primary-main.no-underline')?.innerText || '';
            const author = document.querySelector('div.text-sm.dark:text-text-disabled')?.innerText || '';
            const readingTime = document.querySelector('div.Text_body__snVk8.text-base.dark:text-text-disabled.dark:[&_a]:text-tertiary-main.text-grey-600')?.innerText || '';
            return { title, category, author, readingTime }; 
        });
        articles.push(article);
    }

    await browser.close();
    return articles;
};

const saveGoogleSheet = async (data) => {  
    const request = {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'Sheet1!J30',
        valueInputOption: 'RAW',
        resource: {
            values: [
                ['Titular', 'Categoría', 'Autor', 'Tiempo de lectura'],
                ...data.map(article => [article.title, article.category, article.author, article.readingTime])
            ]
        }
    };
    await sheets.spreadsheets.values.append(request);
};


// async function scrappingBlog(categoria){
//     const url = `https://xepelin.com/blog/${categoria}`;
//     const {data} = await axios.get(url);
//     const $ = cheerio.load(data);

//     let scrapedData = [];

//     $('.blog-post').each((index, element) => {
//         const title = $(element).find('.title').text();
//         const author = $(element).find('.author').text();
//         const readingTime = $(element).find('.reading-time').text();
//         const publicationDate = $(element).find('.publication-date').text();
//         const category = $(element).find('.category').text();

//         scrapedData.push({
//             title,
//             category,
//             author,
//             readingTime,
//             publicationDate,
//         });
//     });

//     return scrapedData;
// }

// async function saveGoogleSheet(data){
//     const auth = new google.auth.GoogleAuth({
//         credentials: {
//             client_email: process.env.GOOGLE_CLIENT_EMAIL,
//             private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
//         },
//         scopes: ['https://www.googleapis.com/auth/spreadsheets']
//     });

//     const sheets = google.sheets({version: 'v4', auth});
//     const spreadsheetId = process.env.SPREADSHEET_ID;

//     const response = await sheets.spreadsheets.values.append({
//         spreadsheetId,
//         range: 'Sheet1!A1',
//         valueInputOption: 'RAW',
//         resource: {
//             values: [
//             ['Titular', 'Categoría', 'Autor', 'Tiempo de lectura', 'Fecha de publicación'],
//             ...data.map(item => [item.title, item.category, item.author, item.readingTime, item.publicationDate])
//             ]
//         }
//     });
//     return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
// }

module.exports = {
    scrappingBlog,
    saveGoogleSheet
};