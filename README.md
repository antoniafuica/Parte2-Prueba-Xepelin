# Xepelin Web Scraping API

Esta aplicación está deployada en Render y permite realizar web scraping de la sección "Blog" de Xepelin para una categoría específica y guardar los datos en una hoja de Google Sheets. La API también envía una notificación a un webhook una vez que el scraping está completo.


## Tecnologías utilizadas

- Node.js
- Express
- Puppeteer
- Cheerio
- Google Sheets API

## Uso App

### POST /api/xepelin/scrapping

Este endpoint recibe los parámetros `category` y `webhook` para iniciar el scraping y notificar cuando se complete.

- `category` (string): La categoría del blog a scrapear (por ejemplo, "PyMEs").
- `webhook` (string): `https://hooks.zapier.com/hooks/catch/11217441/bfemddr/`

#### Ejemplo de uso
POST desde Postman por ejemplo a: `https://parte2-prueba-xepelin.onrender.com/api/xepelin/scrapping`
    
Incorporar header: 
    
        ```
        Content-Type: application/json
        ```

Incorporar body: 

    ```json
    {
        "category": "pymes",
        "webhook": "https://hooks.zapier.com/hooks/catch/11217441/bfemddr/"
    }
    ```

## Links 
- Link Google Sheets: `https://docs.google.com/spreadsheets/d/1Zi99g0ndE5D5zlvCvJux8MCzxLVqd5B-TmF40VpMcMk/edit?gid=0#gid=0`
- Link API: `https://parte2-prueba-xepelin.onrender.com`
- Link Github: `https://github.com/antoniafuica/Parte2-Prueba-Xepelin/tree/main`


