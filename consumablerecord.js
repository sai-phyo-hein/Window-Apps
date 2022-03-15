const remote = require('electron').remote;
const BrowserWindow = require('electron').BrowserWindow;
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcRenderer;
const gg = require('./google.js');
const report = require('./report.js');
const worksheetId = "Consumable";
const worksheetID_1 = "Stock";


var entrytype = document.getElementById('type');
entrytype.addEventListener('change', function(event){

    var consume = require('./consume.json');
    //Get consumable name list
    var consume_name_list = [];
    for (let i=0; i<consume.length; i++){
        consume_name_list.push(consume[i].Name);
    }
    const recorded_consume_name = [... new Set(consume_name_list)].sort();

    //Get all used store site
    function all_store_site(){
        var store_list = []
        for (let i =0; i< consume.length; i++){
            store_list.push(consume[i].Store_at)
        }
        return [... new Set(store_list)].sort()
    }

    if (this.value === 'withdraw'){
        var name = document.getElementById('consumablename');
        var select_name = document.createElement('select');
        select_name.setAttribute('id', 'consumablename');
        for (let i = 0; i < recorded_consume_name.length; i++) {
            var c_name_option = document.createElement("option");
            c_name_option.setAttribute("value", recorded_consume_name[i]);
            c_name_option.text = recorded_consume_name[i];
            select_name.appendChild(c_name_option);
        };
        select_name.setAttribute('onchange', 
        `
        var consume = require('./consume.json');
        //Get consumable unit list
        function unit_hint(con_name){
            var focus_consume_unit = []
            for (let i=0; i<consume.length; i++){
                if (consume[i].Name === con_name){
                    focus_consume_unit.push(consume[i].Unit)
                }
            }
            var hint = [... new Set(focus_consume_unit)][0];
            return hint
        }

        //Get store site list of specific consumable name
        function store_site_list(con_name){
            var store_list = []
            for (let i=0; i<consume.length; i++){
                if (consume[i].Name === con_name){
                    store_list.push(consume[i].Store_at)
                }
            }
            return store_list[store_list.length - 1]
        }

        //Get stock
        function get_stock(con_name){
            var stock = 0
            for (let i=0; i < consume.length; i++){
                if (consume[i].Name === con_name){
                    stock = stock + parseFloat(consume[i].Stock);
                    break
                }
            }
            return stock.toString()
        }

        const Dialogs = require('dialogs');
        const dialogs = Dialogs();

        var unit = document.getElementById('unit');
        var show_hint = unit_hint(document.getElementById('consumablename').value)
        unit.value = show_hint;
        unit.disabled = true;

        if (document.getElementById('consumablename') !== '#Select Consumable Name'){
            var store_site = store_site_list(document.getElementById('consumablename').value).toString();
            var message = "Selected consumable is stored at " + store_site;
            dialogs.alert(message);
        }
        var stock_hint = document.createElement('p');
        var stock_hint_txt = "Stock : " + get_stock(document.getElementById('consumablename').value) + " " + show_hint;
        stock_hint.innerHTML = stock_hint_txt;

        document.getElementById('hint').appendChild(stock_hint)
        `)
        name.replaceWith(select_name);

        var amount = document.getElementById('amount');
        amount.setAttribute('onchange', 
        `
        var consume = require('./consume.json');
        const Dialogs = require('dialogs');
        const dialogs = Dialogs();

        var stock = 0;
        if (document.getElementById('consumablename').value !== '#Select Consumable Name') {
            for (let i=0; i< consume.length; i++){
                if (consume[i].Name === document.getElementById('consumablename').value){
                    stock = stock + parseFloat(consume[i].Stock);
                    break;
                }
            }
            if (parseFloat(document.getElementById('amount').value) > stock){
                var stock_txt = "Maximum stock is : " + stock.toString();
                dialogs.alert(stock_txt);
            }
        }
        else{
            dialogs.alert("Select a valid consumable name")
        }

        
        `)

        var unit = document.getElementById('unit');
        var input_unit = document.createElement('input');
        input_unit.setAttribute('id', 'unit');
        unit.replaceWith(input_unit);

        document.getElementById('commentlabel').innerHTML = "Purpose of Usage : ";

        var purpose = document.getElementById('store_or_purpose');
        var input_purpose = document.createElement('input');
        input_purpose.setAttribute('id', 'store_or_purpose');
        input_purpose.setAttribute('type', 'text');
        purpose.replaceWith(input_purpose);

        document.getElementById('item_type_div').innerHTML = "";

        
    }
    else if (this.value === 'refill'){
        var name = document.getElementById('consumablename');
        var select_name = document.createElement('select');
        select_name.setAttribute('id', 'consumablename');
        for (let i = 0; i < recorded_consume_name.length; i++) {
            var c_name_option = document.createElement("option");
            c_name_option.setAttribute("value", recorded_consume_name[i]);
            c_name_option.text = recorded_consume_name[i];
            select_name.appendChild(c_name_option);
        };
        select_name.setAttribute('onchange', 
        `
        var consume = require('./consume.json');
        //Get consumable unit list
        function unit_hint(con_name){
            var focus_consume_unit = []
            for (let i=0; i<consume.length; i++){
                if (consume[i].Name === con_name){
                    focus_consume_unit.push(consume[i].Unit)
                }
            }
            var hint = [... new Set(focus_consume_unit)][0];
            return hint
        }

        //Get store site list of specific consumable name
        function store_site_list(con_name){
            var store_list = []
            for (let i=0; i<consume.length; i++){
                if (consume[i].Name === con_name){
                    store_list.push(consume[i].Store_at)
                }
            }
            return store_list[store_list.length - 1]
        }

        var unit = document.getElementById('unit');
        var show_hint = unit_hint(document.getElementById('consumablename').value)
        unit.value = show_hint;

        const Dialogs = require('dialogs');
        const dialogs = Dialogs();
        if (document.getElementById('consumablename') !== '#Select Consumable Name'){
            var store_site = store_site_list(document.getElementById('consumablename').value).toString();
            var message = "Previous purchases are stored at " + store_site;
            dialogs.alert(message);
        }
        `)

        name.replaceWith(select_name);

        document.getElementById('amount').removeAttribute('onchange');

        var unit = document.getElementById('unit');
        var input_unit = document.createElement('input');
        input_unit.setAttribute('id', 'unit');
        unit.replaceWith(input_unit);

        document.getElementById('commentlabel').innerHTML = "Planned to Store at :"

        var store = document.getElementById('store_or_purpose');
        var select_store = document.createElement('select');
        select_store.setAttribute('id', 'store_or_purpose');
        var store_option_list = all_store_site();
        
        for (let i=0;i<store_option_list.length; i++){
            var store_option = document.createElement('option');
            store_option.setAttribute('value', store_option_list[i])
            store_option.text = store_option_list[i];
            select_store.appendChild(store_option);
        }
        select_store.setAttribute('onchange', 
        `
        if (document.getElementById('store_or_purpose').value == 'z New Place z'){
            const Dialogs = require('dialogs')
            const dialogs = Dialogs()
            dialogs.alert("You may need to discuss with Lab Incharge for locating a new place of storing consumable.")
        }
        `)
        store.replaceWith(select_store);

        document.getElementById('item_type_div').innerHTML = "";
        
    }
    else if (this.value === 'newentry'){
        var name = document.getElementById('consumablename');
        var input_name = document.createElement('input');
        input_name.setAttribute('id', 'consumablename');
        name.replaceWith(input_name);

        document.getElementById('amount').removeAttribute('onchange');

        var unit_list = ["#Select Unit", "milli-liter", "gram", "pack", "piece", "milli-meter"];
        var unit = document.getElementById('unit');
        var select_unit = document.createElement('select');
        select_unit.setAttribute('id', 'unit');
        for (let i=0; i<unit_list.length; i++){
            var unit_option = document.createElement('option');
            unit_option.setAttribute('value', unit_list[i])
            unit_option.text = unit_list[i]
            select_unit.appendChild(unit_option);
        }
        unit.replaceWith(select_unit);

        document.getElementById('commentlabel').innerHTML = "Planned to Store at :";

        var store = document.getElementById('store_or_purpose');
        var select_store = document.createElement('select');
        select_store.setAttribute('id', 'store_or_purpose');
        var store_option_list = all_store_site();
        
        for (let i=0;i<store_option_list.length; i++){
            var store_option = document.createElement('option');
            store_option.setAttribute('value', store_option_list[i])
            store_option.text = store_option_list[i];
            select_store.appendChild(store_option);
        }

        select_store.setAttribute('onchange', 
        `
        if (document.getElementById('store_or_purpose').value == 'z New Place z'){
            const Dialogs = require('dialogs')
            const dialogs = Dialogs()
            dialogs.alert("You may need to discuss with Lab Incharge for locating a new place of storing consumable.")
        }
        `)
        store.replaceWith(select_store);

        var item_type_div = document.getElementById('item_type_div');
        if  (item_type_div.innerHTML == ""){
            var itemtypelabel = document.createElement('label');
            itemtypelabel.innerHTML = "Item Type :"
            item_type_div.appendChild(itemtypelabel);
            var itemtype_option = ['Consumable', 'Lab_supplementary_item','Equipment_spare_part'];
            var itemtype = document.createElement('select');
            itemtype.setAttribute('id', 'itemtype');
            for (let i=0; i< itemtype_option.length; i++){
                var type_option = document.createElement('option');
                type_option.setAttribute('value', itemtype_option[i])
                type_option.text = itemtype_option[i]
                itemtype.appendChild(type_option);
            }
            item_type_div.appendChild(itemtype);
        }
        var hint = document.getElementById('hint');
        if (hint.innerHTML != ""){
            var temp_hint = document.createElement('div');
            temp_hint.setAttribute('id', 'hint');
            
            var hint_text_con = document.createElement('p');
            hint_text_con.innerHTML = 'Consumables = Items that are consumed/ Items with unrecoverable losses in weight or in performance.';
            temp_hint.appendChild(hint_text_con)

            var hint_text_supp = document.createElement('p');
            hint_text_supp.innerHTML = 'Supplementary = Items that can be re-used for more than 1 year.';
            temp_hint.appendChild(hint_text_supp)

            var hint_text_spare = document.createElement('p');
            hint_text_spare.innerHTML = 'Equipment Spare = Items that are used for specific equipment. (Supplementary of equipment).';
            temp_hint.appendChild(hint_text_spare)

            hint.innerHTML = temp_hint.innerHTML;

        }
        else if (hint.innerHTML == ""){
            
            var hint_text_con = document.createElement('p');
            hint_text_con.innerHTML = 'Consumables = Items that are consumed/ Items with unrecoverable losses in weight or in performance.';
            hint.appendChild(hint_text_con)

            var hint_text_supp = document.createElement('p');
            hint_text_supp.innerHTML = 'Supplementary = Items that can be re-used for more than 1 year.';
            hint.appendChild(hint_text_supp)

            var hint_text_spare = document.createElement('p');
            hint_text_spare.innerHTML = 'Equipment Spare = Items that are used for specific equipment. (Supplementary of equipment).';
            hint.appendChild(hint_text_spare)

        }

    }
    else if (this.value === ''){ 
        document.getElementById('item_type_div').innerHTML = "";
    }
});
var savebtn = document.getElementById('save');
savebtn.addEventListener('click', function(event){

    const perform = require('./signinperson.json');
    var consume = require('./consume.json');

    //Get person signing in 
    function lastPerson(personlist){
        var namelist = personlist;
        return namelist[namelist.length-1];
    };

    //Get item type of specific consumable
    function get_item_type(con_name){
        var type_list = [];
        for (let i=0; i< consume.length; i++){
            if (consume[i].Name === con_name){
                type_list.push(consume[i].Type);
            }
        }
        return type_list[0]
    }

    const id_list = ['date','type', 'consumablename'];
    var value_list = [];
    for (i=0;i<id_list.length; i++){
        value_list.push(document.getElementById(id_list[i]).value)
    }
    var amount_value = document.getElementById('amount').value;
    if ((document.getElementById('type').value === 'refill' && amount_value < 0) || (document.getElementById('type').value === 'newentry' && amount_value < 0)){
        amount_value = amount_value * (-1)
    }
    else if (document.getElementById('type').value === 'withdraw' && amount_value > 0){
        amount_value = amount_value * (-1)
    }
    value_list.push(amount_value);
    value_list.push(document.getElementById('unit').value);
    value_list.push(document.getElementById('store_or_purpose').value);

    if (document.getElementById('type').value === 'newentry'){
        value_list.push(document.getElementById('itemtype').value);
    }
    else if (document.getElementById('type').value === 'refill' || document.getElementById('type').value === 'withdraw'){
        value_list.push(get_item_type(document.getElementById('consumablename').value))
    }

    value_list.push(lastPerson(perform));
    

    function empty_count(array){
        var num_empty = 0;
        for (let i=0; i<array.length; i++){
            if (array[i] === "#Select Consumable Name" || array[i] === "#Select Unit" ||array[i] === ""){
                num_empty = num_empty + 1;
            }
        }
        return num_empty
    }

    var empty = empty_count(value_list);

    if (empty < 1){
        const Dialogs = require('dialogs');
        const dialogs = Dialogs();
        
        if (document.getElementById('type').value === 'newentry'){
            var obj = {
                "Name" : document.getElementById('consumablename').value, 
                "Unit" : document.getElementById('unit').value,
                "Store_at" : document.getElementById('store_or_purpose').value, 
                "Type" : document.getElementById('itemtype').value, 
                "Stock" : document.getElementById('amount').value
            }
            consume.push(obj);
            var outputdata = JSON.stringify(consume);
            
            const fs = require('fs');
            fs.writeFile('./resources/app/consume.json', outputdata, err => {
                if (err) throw err;
            });
        }
        else if (document.getElementById('type').value === 'refill'){
            
            for (let i=0; i< consume.length; i++){
                if (document.getElementById('consumablename').value === consume[i].Name){
                    var temp_stock = parseFloat(consume[i].Stock) + parseFloat(document.getElementById('amount').value);
                    consume[i].Stock = temp_stock.toString();
                    break;
                }
            }
            var outputdata = JSON.stringify(consume);
            
            const fs = require('fs');
            fs.writeFile('./resources/app/consume.json', outputdata, err => {
                if (err) throw err;
            });

        }
        else if (document.getElementById('type').value === 'withdraw'){
            
            for (let i=0; i< consume.length; i++){
                if (document.getElementById('consumablename').value === consume[i].Name){
                    var temp_stock = parseFloat(consume[i].Stock) - parseFloat(document.getElementById('amount').value);
                    consume[i].Stock = temp_stock.toString();
                    break;
                }
            }
            var outputdata = JSON.stringify(consume);
            
            const fs = require('fs');
            fs.writeFile('./resources/app/consume.json', outputdata, err => {
                if (err) throw err;
            });

        }
        gg.save_data(worksheetId, value_list);
        
        dialogs.alert("Data Uploaded!!!")

        document.getElementById('refresh').click();
    }
    else{
        const Dialogs = require('dialogs');
        const dialogs = Dialogs();
        dialogs.alert("Some values are missing!!! Double check please.")
    }
        
    
})

var refresh = document.getElementById('refresh');
refresh.addEventListener('click', function(event){
    document.getElementById('date').value = "";
    document.getElementById('type').value = "";
    document.getElementById('amount').value = "";
    
})