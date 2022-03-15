const remote = require('electron').remote;
const BrowserWindow = require('electron').BrowserWindow;
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcRenderer;

const data = require('./account.json');

function lastPerson(personlist){
        var namelist = personlist;
        return namelist[namelist.length-1];
};

async function align_local_db(){
    var consume_stat = "";
    const {google} = require('googleapis');
    const { read } = require('original-fs');
    const auth = new google.auth.GoogleAuth({
    keyFile: "./keys.json", 
    scopes: "https://www.googleapis.com/auth/spreadsheets", 
    });
    const authClientObject = auth.getClient();
    const googleSheetInstance = google.sheets({version:"v4", auth: authClientObject});
    const spreadsheetId = "1HHQZfh4T_PJW_eAvECrkr5n0GzJaETsW64c2ArXJmT4";

    const range1 = "Stock!A4:F200";
    const range2 = "Stock!I4:N200";

    var res_con = (await googleSheetInstance.spreadsheets.values.batchGet(
        {
            auth, 
            spreadsheetId,
            ranges: range1,
            majorDimension: "ROWS"
        }
    )).data["valueRanges"][0]["values"];
    var res_spare = (await googleSheetInstance.spreadsheets.values.batchGet(
        {
            auth, 
            spreadsheetId, 
            ranges: range2,
            majorDimension: "ROWS"
        }
    )).data["valueRanges"][0]["values"];

    const stock_db = res_con.concat(res_spare);

    var consume = require('./consume.json')
    // align consumable with database
    for (let i = 0; i< consume.length; i++){
        for (let j = 0; j< stock_db.length; j++){
            if ((consume[i].Name === stock_db[j][0]) && (consume[i].Unit === stock_db[j][2])){
                consume[i].Stock = stock_db[j][1].toString()
            }
        }
    }
    loop1:
        for (let i = 0; i < stock_db.length; i++){
            
            var exist = true
            loop2:
                for (let j = 0; j< consume.length; j++){
                    if (stock_db[i][0] == consume[j].Name){
                        exist = true 
                        break loop2;
                    }
                    else {
                        exist = false

                    }
                }
                
                if (exist == false){
                    var temp_obj = {"Name":"","Unit":"","Store_at":"","Type":"","Stock":""}
                    temp_obj["Name"] = stock_db[i][0]
                    temp_obj["Unit"] = stock_db[i][2]
                    temp_obj["Store_at"] = stock_db[i][4]
                    temp_obj["Type"] = stock_db[i][3]
                    temp_obj["Stock"] = stock_db[i][1].toString()
                    var temp_item = [temp_obj]
                    consume = consume.concat(temp_item)
                }
        }
    
    var outputdata = JSON.stringify(consume);
    
            
    const fs = require('fs');
    fs.writeFile('./resources/app/consume.json', outputdata, err => {
        if (err) throw err;
    });
    

    // update status of consumables and equipment and samples

    //consumbles
    var less_stock = [];
    for (let i = 0; i < stock_db.length ; i++){
        const percent_left = parseFloat(stock_db[i][5].slice(0, -1))
        if (percent_left < 50.00){
            less_stock.push(stock_db[i][0])
        }
    }
    if (less_stock.length > 0){
        var status = require('./status.json')
        status[0]["Out_Consumable"] = less_stock
    }
    else{
        status[0]["Out_Consumable"] = []
    }
        
    var con_status = JSON.stringify(status)

    fs.writeFile('./resources/app/status.json', con_status, err => {
        if (err) throw err;
    });

}

align_local_db();

const signinbtn = document.getElementById('signinbtn');
signinbtn.addEventListener('click', function(event) {
    
    if (document.getElementById('name').value === ""){
        document.getElementById('name').style.boxShadow = '2px 2px 5px #f00';
    }
    else if (document.getElementById('acc').value === ""){
        document.getElementById('acc').style.boxShadow = '2px 2px 5px #f00';
    }
    else{
        const signinperson = require('./signinperson.json');
        var last_signin = lastPerson(signinperson)
        var name = document.getElementById('name').value;
        var acc = document.getElementById('acc').value;
        var access = 0;
        for(let i=0; i<data.length; i++){
            if (data[i].Name == name && data[i].Account == acc){
                if (name != last_signin){
                    var userdata = {"Name" : name}
                    signinperson.push(name);
                    var recorddata = JSON.stringify(signinperson);
                    
                    const fs = require('fs');
                    fs.writeFile('./resources/app/signinperson.json', recorddata, err => {
                        if (err) throw err;
                    });
                }
                access = 1;
                break;
            }
            else{
                access = 0;
            }
        }
            
        if (access === 1){
            document.getElementById('entry').style.boxShadow =  '2px 2px 5px #0f0';
            ipc.send('show-dashboard');
        }
        else{
            document.getElementById('entry').style.boxShadow =  '2px 2px 5px #f00';
        };
    }
});

var name_input = document.getElementById('name');
name_input.addEventListener('change', function(event){
    if (this.value !== ""){
        this.style.boxShadow = '';
    }
})

var acc_input = document.getElementById('acc');
acc_input.addEventListener('change', function(event){
    if (this.value !== ""){
        this.style.boxShadow = '';
    }
})

var acc_no = document.getElementById('acc');
acc_no.addEventListener('keyup', function(event){
    if (event.keyCode === 13){
        event.preventDefault();
        document.getElementById("signinbtn").click();
    };
});

