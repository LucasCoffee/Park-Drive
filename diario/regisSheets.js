const { google } = require("googleapis");
const sheetsId = require("../diario/sheetsId.json")

async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
      keyFile: "diario/credenciais.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
  
    const client = await auth.getClient();
  
    const googleSheets = google.sheets({
      version: "v4",
      auth: client,
    });
  
    const spreadsheetId = sheetsId.spreadsheetId;
  
    return {
      auth,
      client,
      googleSheets,
      spreadsheetId,
    };
};

async function getRows(){

    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const getRows = await googleSheets.spreadsheets.values.get({
        auth, spreadsheetId, range: "Página1"
    }).then(response => {
        console.log(response.data.values)
    })
}

async function addRow(dados){

    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();


    const addVeiculo = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Página1",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: dados
        }
    }).then(response => {
        console.log(response);
    }).catch(err => {
        console.log(err)
    })

}

module.exports = addRow