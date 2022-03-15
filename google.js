const report = require('./report.js');
const {google} = require('googleapis');
const { read } = require('original-fs');
const auth = new google.auth.GoogleAuth({
    keyFile: "./keys.json", 
    scopes: "https://www.googleapis.com/auth/spreadsheets", 
});
const authClientObject = auth.getClient();
const googleSheetInstance = google.sheets({version:"v4", auth: authClientObject});
const spreadsheetId = "1HHQZfh4T_PJW_eAvECrkr5n0GzJaETsW64c2ArXJmT4";

module.exports = {
    save_data : function(worksheetId, value_list){
        var range = worksheetId + "!A:AZ";
        googleSheetInstance.spreadsheets.values.append({
            auth, 
            spreadsheetId, 
            range: range, 
            valueInputOption: "USER_ENTERED", 
            resource:{
                values:[value_list],
            },
        
        });
    }
}