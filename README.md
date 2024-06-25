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

- `category` (string): La categoría del blog a scrapear (por ejemplo, pymes, corporativos, educacion-financiera).
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

O con comando CURL: 

````
curl -X POST https://parte2-prueba-xepelin.onrender.com/api/xepelin/scrapping -H "Content-Type: application/json" -d '{
  "category": "PyMEs",
  "webhook": "https://hooks.zapier.com/hooks/catch/11217441/bfemddr/"
}'
````

## Links 
- Link Google Sheets: `https://docs.google.com/spreadsheets/d/1Zi99g0ndE5D5zlvCvJux8MCzxLVqd5B-TmF40VpMcMk/edit?gid=0#gid=0`
- Link API: `https://parte2-prueba-xepelin.onrender.com`
- Link Github: `https://github.com/antoniafuica/Parte2-Prueba-Xepelin/tree/main`

## Variables de entorno
````
    PORT=5001
    GOOGLE_CLIENT_EMAIL=tu_email_de_servicio@google.com
    GOOGLE_PRIVATE_KEY=tu_clave_privada
    SPREADSHEET_ID=tu_id_de_google_sheets
    EMAIL=tu_email_para_notificaciones
````

## Instrucciones para correr la aplicación
Para iniciar el servidor:
```bash
yarn start
