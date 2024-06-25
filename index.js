const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { scrappingBlog, saveGoogleSheet } = require('./scrapping');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json()); 

app.post('api/xepelin/scrapping', async (req, res) => {
    const {category, webhook} = req.body;

    console.log("Recibiendo request con categoria:", category);

    try{
        const articles = await scrappingBlog(category); 
        console.log("Scraping completo, articulos encontrados:", articles.length);

        await saveGoogleSheet(articles); 
        console.log("Data guardada en GS");

        await axios.post(webhook, { 
            email: process.env.EMAIL,
            link: `https://docs.google.com/spreadsheets/d/${process.env.SPREADSHEET_ID}`
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        
        });

        console.log("Webhook notification enviado");
        res.status(200).send('Scrapping completo y datos guardados en Google Sheet');    
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al realizar el scrapping');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

