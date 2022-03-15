
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcRenderer;

const data = require('./account.json');


const registerbtn = document.getElementById('Register');

registerbtn.addEventListener('click', function(){
    var name = document.getElementById("name").value;
    var acc = document.getElementById('acc').value;
    var mail = document.getElementById('mail').value;
    if (name.length<1){
        document.getElementById('name').setAttribute('style', 'box-shadow: 2px 2px 5px #f00;');
    }else if (acc.length<1){
        document.getElementById('acc').setAttribute('style', 'box-shadow: 2px 2px 5px #f00;');
    }else if (mail.length<1){
        document.getElementById('mail').setAttribute('style', 'box-shadow: 2px 2px 5px #f00;');
    }else{
        var obj = {
            "Name" : name, 
            "Account" : acc,
            "Mail" : mail
        }
        data.push(obj);
        var outputdata = JSON.stringify(data);
        
        const fs = require('fs');
        fs.writeFile('./resources/app/account.json', outputdata, err => {
            if (err) throw err;
        });
        alert("Registration Complete! You can now sign in with these data.");
        alert('Recheck and save your inputs, these will be used on next signing in.');
        if (document.getElementById('info1').innerHTML == ""){
            document.getElementById('info1').innerHTML = "You can now close this and restart for signing in. ";
            document.getElementById('info2').innerHTML = "OR";
            document.getElementById('info3').innerHTML = "You can register for more."
        }
    }

})