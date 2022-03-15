const remote = require('electron').remote;
const BrowserWindow = require('electron').BrowserWindow;
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcRenderer;
const google = require('./google.js');

const worksheetID_1 = "Stock";

var menubtn = document.getElementById('menubtn');
var navpane = document.getElementById('navigationpane');
var testbtn = document.getElementById('testledgerentry');
var consumebtn = document.getElementById('consumablerecord');
var maintebtn = document.getElementById('equipmentmainte');



menubtn.addEventListener('click', function(event){
    if (navpane.style.left == "-300px"){
        navpane.style.left = "0px";
        menubtn.innerHTML = "x";

    }else{
        navpane.style.left = '-300px';
        menubtn.innerHTML = "≡";
    }
});

testbtn.addEventListener('click', function(event){
    ipc.send('show-testledgerentry');
})
consumebtn.addEventListener('click', function(event){
    ipc.send('show-consumableledger');
})

maintebtn.addEventListener('click', function(event){
    ipc.send('show-mainte')
})


//get consume status and show status
async function update_dash(){
    var status = require('./status.json')
    for (let i = 0; i < status[0]["Out_Consumable"].length; i++){
        var c_status = document.createElement('p');
        c_status.innerHTML = status[0]["Out_Consumable"][i] + " is (almost/) out of stock. Need Action!!!"
        document.getElementById("log").appendChild(c_status)
    }
    
}
update_dash();