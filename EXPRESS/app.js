require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});
const PUERTO = 4300;

app.get('/', async (solicitud, respuesta) => {
    const client = await auth.getClient();
    const googleSheet = google.sheets({ version: 'v4', auth: client });
    const request = {
        spreadsheetId: process.env.SPREADSHEET_ID1,
        range: `${process.env.ID_HOJA1_RANGO}`
    };
    try {
        const respuesta = (await googleSheet.spreadsheets.values.get(request)).data.values;
        main(respuesta, googleSheet);
    } catch (error) {
        console.error(error);    
    };
    async function main(respuesta, googleSheet) {
        const spreadsheetId = process.env.SPREADSHEET_ID2;
        const request2 = {
            spreadsheetId: process.env.SPREADSHEET_ID2,
            range: `${process.env.ID_HOJA2_RANGO}`
        };
        try {
            const respuesta2 = (await googleSheet.spreadsheets.values.get(request2)).data.values;
            if(respuesta2 === undefined) {
                await googleSheet.spreadsheets.values.append({
                    auth,
                    spreadsheetId,
                    range: `${process.env.ID_HOJA2_RANGO}`,
                    valueInputOption: "USER_ENTERED",
                    requestBody: {
                        "range": `${process.env.ID_HOJA2_RANGO}`,
                        "values": respuesta
                    }
                });
                console.log('Datos agregados correctamente.');
            }else {
                await googleSheet.spreadsheets.values.update({
                    auth,
                    spreadsheetId,
                    range: `${process.env.ID_HOJA2_RANGO}`,
                    valueInputOption: "USER_ENTERED",
                    requestBody: {
                        "range": `${process.env.ID_HOJA2_RANGO}`,
                        "values": respuesta
                    }
                });
                console.log('Datos actualizados correctamente.');
            }
        } catch (error) {
            console.error(error);    
        };
    };
});

app.listen(PUERTO || process.env.PORT, () => {
    console.log(`funcionando en el puerto ${PUERTO || process.env.PORT}`);
});