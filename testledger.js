const remote = require('electron').remote;
const BrowserWindow = require('electron').BrowserWindow;
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcRenderer;
const google = require('./google.js');
const report = require('./report.js');


//saving spreadsheet
const worksheetId = "TestLedger";

function lastPerson(personlist){
    var namelist = personlist;
    return namelist[namelist.length-1];
};

function findPos(obj){
    var curleft = 0;
    var curtop = 0;
 
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
       
    return {X:curleft,Y:curtop};
 }

var person = 0;
//Perform peson toggling button function
performtoggbtn.addEventListener('click', function(){
    var performtoggbtn = document.getElementById('performtoggbtn');
    var performtoggbg = document.getElementById('performtoggbg');
    var x = performtoggbtn.offsetLeft;
    var bgx = performtoggbg.offsetLeft;
    if (x==bgx+2){
        person = 1;
        updatex = (x+20).toString() + "px";
        performtoggbtn.style.position = 'absolute';
        performtoggbtn.style.left = updatex;
        var byother = document.createElement('input');
        byother.placeholder = "Name";
        byother.setAttribute("id", "byother");
        byother.setAttribute('style', 'color:rgba(0,0,0,.8)')
        document.getElementById("performtoggfield").appendChild(byother);
        document.getElementById('byotherl').style.color = "rgba(245, 234, 239, 1)";
        document.getElementById('byme').style.color = "rgba(10,10,10, 0.5)";
        performtoggbtn.style.backgroundColor = "rgba(142, 148, 65, 0.5)";
    }else{
        person = 0;
        performtoggbtn.style.position = 'relative';
        performtoggbtn.style.left = "0px";
        document.getElementById("byother").remove();
        document.getElementById('byotherl').style.color = "rgba(245, 234, 239, 0.5)";
        document.getElementById('byme').style.color = "rgba(10,10,10)";
        performtoggbtn.style.backgroundColor = "rgba(168, 208, 218, 0.5)";
    }
});

//Expanding Test Data Entry field based on the sample type chosen. 
const samptype = document.getElementById('type');
samptype.addEventListener("change", function(event){

    var datasection = document.getElementById('datasection');

    if (samptype.value == "CPL Pretreatment") {

        var datafield = document.createElement('div');
        datafield.setAttribute('id', 'datafield');

        datafield.style.width = '50%';
        datafield.style.boxShadow =  '0px 0px 5px #fff';
        datafield.style.borderRadius = '20px';
        //Create title for data field
        var label1 = document.createElement("label");
        label1.innerHTML = "Please Enter Test Data:";
        label1.setAttribute('style', 'color: rgba(255, 255, 255');
        datafield.appendChild(label1);
        
        var samplingdate = document.createElement('input');
        samplingdate.setAttribute('id', 'samplingdate');
        samplingdate.placeholder = 'Enter Sampling Date';
        
        samplingdate.setAttribute('style', 'color: rgba(0,0,0)')
        samplingdate.setAttribute('onfocus', "(this.type = 'date')");
        datafield.appendChild(samplingdate);
        
        //Create array of options to be added
        var array = ["3times Test(O3-M3-D3)","1time Test(O-M-D)"];

        
        //Create and append select list
        var testpoint = document.createElement("select");
        testpoint.setAttribute("id", "testpointtype");
        //Create and append the options
        for (var i = 0; i < array.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value", array[i]);
            option.text = array[i];
            testpoint.appendChild(option);
        };
        
        testpoint.setAttribute("onchange",
        `
        if(this.value === "1time Test(O-M-D)") {
            disable_array = ['blankT2', 'blankT3', 'blankB2', 'blankB3','operatorT2', 'operatorT3', 'operatorB2', 'operatorB3', 'middleT2', 'middleT3','middleB2','middleB3', 'driverT2', 'driverT3', 'driverB2', 'driverB3'];
            
            for(let i=0; i<disable_array.length; i++){
                document.getElementById(disable_array[i]).disabled = true;
                document.getElementById(disable_array[i]).value = "";
                document.getElementById('blankT1').value = "";
                document.getElementById('operatorT1').value = "";
                document.getElementById('middleT1').value = "";
                document.getElementById('driverT1').value = "";
                document.getElementById('blankB1').value = "";
                document.getElementById('operatorB1').value = "";
                document.getElementById('middleB1').value = "";
                document.getElementById('driverB1').value = "";
            }
        }
        else if (this.value === "3times Test(O3-M3-D3)"){
            disable_array = ['blankT2', 'blankT3', 'blankB2', 'blankB3','operatorT2', 'operatorT3', 'operatorB2', 'operatorB3', 'middleT2', 'middleT3','middleB2','middleB3', 'driverT2', 'driverT3', 'driverB2', 'driverB3'];
            for(let i=0; i<disable_array.length; i++){
                document.getElementById(disable_array[i]).disabled = false;
            }
        };
        `)
        datafield.appendChild(testpoint);

        //Create and append select list
        var basetype = document.createElement("select");
        basetype.setAttribute("id", "basetype");
        datafield.appendChild(basetype);
        
        var b_option = ['GL(35~45mg/m^2)', 'GI(25~35mg/m^2)'];
        //Create and append the options
        for (var i = 0; i < array.length; i++) {
            var base_option = document.createElement("option");
            base_option.setAttribute("value", b_option[i]);
            base_option.text = b_option[i];
            basetype.appendChild(base_option);
        };

        //Create and append select list
        var bmt = document.createElement("select");
        bmt.setAttribute("id", "bmt");
        datafield.appendChild(bmt);
        
        var bmt_option = ['BMT(NIL)', '0.25mm', '0.30mm', '0.35mm', '0.38mm', '0.40mm', '0.42mm', '0.46mm'];

        //Create and append the options
        for (var i = 0; i < bmt_option.length; i++) {
            var bmtoption = document.createElement("option");
            bmtoption.setAttribute("value", bmt_option[i]);
            bmtoption.text = bmt_option[i];
            bmt.appendChild(bmtoption);
        };

        var testdata = document.createElement('div');
        testdata.setAttribute('id', 'testdata');
        datafield.appendChild(testdata);

        var blankT_div = document.createElement('div');
        blankT_div.setAttribute('id', 'operator_side');
        testdata.appendChild(blankT_div);
        
        var blankT1 = document.createElement('input');
        blankT1.setAttribute('id', 'blankT1');
        blankT1.setAttribute('placeholder', 'blank T1');
        blankT1.setAttribute('type', 'number');
        blankT1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('blankT1').value/3) + (document.getElementById('blankT2').value)/3 + (document.getElementById('blankT3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('blankT_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('blankT1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('blankT_avg').setAttribute('placeholder', result);
            }
            `
        )
        blankT_div.appendChild(blankT1);

        var blankT2 = document.createElement('input');
        blankT2.setAttribute('id', 'blankT2');
        blankT2.setAttribute('placeholder', 'blank T2');
        blankT2.setAttribute('type', 'number');
        blankT2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('blankT1').value/3) + (document.getElementById('blankT2').value)/3 + (document.getElementById('blankT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('blankT_avg').setAttribute('placeholder', result);
        `);
        blankT_div.appendChild(blankT2);

        var blankT3 = document.createElement('input');
        blankT3.setAttribute('id', 'blankT3');
        blankT3.setAttribute('placeholder', 'blank T3');
        blankT3.setAttribute('type', 'number');
        blankT3.setAttribute('onchange',
        `
        var avg = (document.getElementById('blankT1').value/3) + (document.getElementById('blankT2').value)/3 + (document.getElementById('blankT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('blankT_avg').setAttribute('placeholder', result);
        `
        )
        blankT_div.appendChild(blankT3);

        var blankT_avg = document.createElement('input');
        blankT_avg.setAttribute('id', 'blankT_avg');
        blankT_avg.setAttribute('placeholder', 'blank TAvg');
        blankT_avg.disabled = true;
        blankT_div.appendChild(blankT_avg);

        var blankB_div = document.createElement('div');
        blankB_div.setAttribute('id', 'operator_side');
        testdata.appendChild(blankB_div);
        
        var blankB1 = document.createElement('input');
        blankB1.setAttribute('id', 'blankB1');
        blankB1.setAttribute('placeholder', 'blank B1');
        blankB1.setAttribute('type', 'number');
        blankB1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('blankB1').value/3) + (document.getElementById('blankB2').value)/3 + (document.getElementById('blankB3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('blankB_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('blankB1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('blankB_avg').setAttribute('placeholder', result);
            }
            `
        )
        blankB_div.appendChild(blankB1);

        var blankB2 = document.createElement('input');
        blankB2.setAttribute('id', 'blankB2');
        blankB2.setAttribute('placeholder', 'blank B2');
        blankB2.setAttribute('type', 'number');
        blankB2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('blankB1').value/3) + (document.getElementById('blankB2').value)/3 + (document.getElementById('blankB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('blankB_avg').setAttribute('placeholder', result);
        `);
        blankB_div.appendChild(blankB2);

        var blankB3 = document.createElement('input');
        blankB3.setAttribute('id', 'blankB3');
        blankB3.setAttribute('placeholder', 'blank B3');
        blankB3.setAttribute('type', 'number');
        blankB3.setAttribute('onchange',
        `
        var avg = (document.getElementById('blankB1').value/3) + (document.getElementById('blankB2').value)/3 + (document.getElementById('blankB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('blankB_avg').setAttribute('placeholder', result);
        `
        )
        blankB_div.appendChild(blankB3);

        var blankB_avg = document.createElement('input');
        blankB_avg.setAttribute('id', 'blankB_avg');
        blankB_avg.setAttribute('placeholder', 'blank BAvg');
        blankB_avg.disabled = true;
        blankB_div.appendChild(blankB_avg);

        var o_input_div = document.createElement('div');
        o_input_div.setAttribute('id', 'operatorT_side');
        testdata.appendChild(o_input_div);

        var operatorT1 = document.createElement('input');
        operatorT1.setAttribute('id', 'operatorT1');
        operatorT1.setAttribute('placeholder', 'operator T1');
        operatorT1.setAttribute('type', 'number');
        operatorT1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('operatorT1').value/3) + (document.getElementById('operatorT2').value)/3 + (document.getElementById('operatorT3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('operatorT_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('operatorT1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('operatorT_avg').setAttribute('placeholder', result);
            }
            `
        )
        o_input_div.appendChild(operatorT1);

        var operatorT2 = document.createElement('input');
        operatorT2.setAttribute('id', 'operatorT2');
        operatorT2.setAttribute('placeholder', 'operator T2');
        operatorT2.setAttribute('type', 'number');
        operatorT2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('operatorT1').value/3) + (document.getElementById('operatorT2').value)/3 + (document.getElementById('operatorT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('operatorT_avg').setAttribute('placeholder', result);
        `
        )
        o_input_div.appendChild(operatorT2);

        var operatorT3 = document.createElement('input');
        operatorT3.setAttribute('id', 'operatorT3');
        operatorT3.setAttribute('placeholder', 'operator T3');
        operatorT3.setAttribute('type', 'number');
        operatorT3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('operatorT1').value/3) + (document.getElementById('operatorT2').value)/3 + (document.getElementById('operatorT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('operatorT_avg').setAttribute('placeholder', result);
        `
        )
        o_input_div.appendChild(operatorT3);

        var operatorT_avg = document.createElement('input');
        operatorT_avg.setAttribute('id', 'operatorT_avg');
        operatorT_avg.setAttribute('placeholder', 'OS TAvg');
        operatorT_avg.disabled = true;
        o_input_div.appendChild(operatorT_avg);

        
        var o_input_div = document.createElement('div');
        o_input_div.setAttribute('id', 'operatorB_side');
        testdata.appendChild(o_input_div);

        var operatorB1 = document.createElement('input');
        operatorB1.setAttribute('id', 'operatorB1');
        operatorB1.setAttribute('placeholder', 'operator B1');
        operatorB1.setAttribute('type', 'number');
        operatorB1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('operatorB1').value/3) + (document.getElementById('operatorB2').value)/3 + (document.getElementById('operatorB3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('operatorB_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('operatorB1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('operatorB_avg').setAttribute('placeholder', result);
            }
            `
        )
        o_input_div.appendChild(operatorB1);

        var operatorB2 = document.createElement('input');
        operatorB2.setAttribute('id', 'operatorB2');
        operatorB2.setAttribute('placeholder', 'operator B2');
        operatorB2.setAttribute('type', 'number');
        operatorB2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('operatorB1').value/3) + (document.getElementById('operatorB2').value)/3 + (document.getElementById('operatorB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('operatorB_avg').setAttribute('placeholder', result);
        `
        )
        o_input_div.appendChild(operatorB2);

        var operatorB3 = document.createElement('input');
        operatorB3.setAttribute('id', 'operatorB3');
        operatorB3.setAttribute('placeholder', 'operator B3');
        operatorB3.setAttribute('type', 'number');
        operatorB3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('operatorB1').value/3) + (document.getElementById('operatorB2').value)/3 + (document.getElementById('operatorB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('operatorB_avg').setAttribute('placeholder', result);
        `
        )
        o_input_div.appendChild(operatorB3);

        var operatorB_avg = document.createElement('input');
        operatorB_avg.setAttribute('id', 'operatorB_avg');
        operatorB_avg.setAttribute('placeholder', 'OS BAvg');
        operatorB_avg.disabled = true;
        o_input_div.appendChild(operatorB_avg);

        var m_input_div = document.createElement('div');
        m_input_div.setAttribute('id', 'middleT');
        testdata.appendChild(m_input_div);

        var middleT1 = document.createElement('input');
        middleT1.setAttribute('id', 'middleT1');
        middleT1.setAttribute('placeholder', 'middle T1');
        middleT1.setAttribute('type', 'number');
        middleT1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('middleT1').value/3) + (document.getElementById('middleT2').value)/3 + (document.getElementById('middleT3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('middleT_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('middleT1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('middleT_avg').setAttribute('placeholder', result);
            }
            `
        )
        m_input_div.appendChild(middleT1);

        var middleT2 = document.createElement('input');
        middleT2.setAttribute('id', 'middleT2');
        middleT2.setAttribute('placeholder', 'middle T2');
        middleT2.setAttribute('type', 'number');
        middleT2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('middleT1').value/3) + (document.getElementById('middleT2').value)/3 + (document.getElementById('middleT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('middleT_avg').setAttribute('placeholder', result);
        `
        )
        m_input_div.appendChild(middleT2);

        var middleT3 = document.createElement('input');
        middleT3.setAttribute('id', 'middleT3');
        middleT3.setAttribute('placeholder', 'middle T3');
        middleT3.setAttribute('type', 'number');
        middleT3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('middleT1').value/3) + (document.getElementById('middleT2').value)/3 + (document.getElementById('middleT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('middleT_avg').setAttribute('placeholder', result);
        `
        )
        m_input_div.appendChild(middleT3);
        
        var middleT_avg = document.createElement('input');
        middleT_avg.setAttribute('id', 'middleT_avg');
        middleT_avg.setAttribute('placeholder', 'MS TAvg');
        middleT_avg.disabled = true;
        m_input_div.appendChild(middleT_avg);

        var m_input_div = document.createElement('div');
        m_input_div.setAttribute('id', 'middleB');
        testdata.appendChild(m_input_div);

        var middleB1 = document.createElement('input');
        middleB1.setAttribute('id', 'middleB1');
        middleB1.setAttribute('placeholder', 'middle B1');
        middleB1.setAttribute('type', 'number');
        middleB1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('middleB1').value/3) + (document.getElementById('middleB2').value)/3 + (document.getElementById('middleB3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('middleB_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('middleB1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('middleB_avg').setAttribute('placeholder', result);
            }
            `
        )
        m_input_div.appendChild(middleB1);

        var middleB2 = document.createElement('input');
        middleB2.setAttribute('id', 'middleB2');
        middleB2.setAttribute('placeholder', 'middle B2');
        middleB2.setAttribute('type', 'number');
        middleB2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('middleB1').value/3) + (document.getElementById('middleB2').value)/3 + (document.getElementById('middleB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('middleB_avg').setAttribute('placeholder', result);
        `
        )
        m_input_div.appendChild(middleB2);

        var middleB3 = document.createElement('input');
        middleB3.setAttribute('id', 'middleB3');
        middleB3.setAttribute('placeholder', 'middle B3');
        middleB3.setAttribute('type', 'number');
        middleB3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('middleB1').value/3) + (document.getElementById('middleB2').value)/3 + (document.getElementById('middleB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('middleB_avg').setAttribute('placeholder', result);
        `
        )
        m_input_div.appendChild(middleB3);
        
        var middleB_avg = document.createElement('input');
        middleB_avg.setAttribute('id', 'middleB_avg');
        middleB_avg.setAttribute('placeholder', 'MS BAvg');
        middleB_avg.disabled = true;
        m_input_div.appendChild(middleB_avg);

        var d_input_div = document.createElement('div');
        d_input_div.setAttribute('id', 'driverT_side');
        testdata.appendChild(d_input_div);

        var driverT1 = document.createElement('input');
        driverT1.setAttribute('id', 'driverT1');
        driverT1.setAttribute('placeholder', 'driver T1');
        driverT1.setAttribute('type', 'number');
        driverT1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('driverT1').value/3) + (document.getElementById('driverT2').value)/3 + (document.getElementById('driverT3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('driverT_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('driverT1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('driverT_avg').setAttribute('placeholder', result);
            }
            `
        )
        d_input_div.appendChild(driverT1);

        var driverT2 = document.createElement('input');
        driverT2.setAttribute('id', 'driverT2');
        driverT2.setAttribute('placeholder', 'driver T2');
        driverT2.setAttribute('type', 'number');
        driverT2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('driverT1').value/3) + (document.getElementById('driverT2').value)/3 + (document.getElementById('driverT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('driverT_avg').setAttribute('placeholder', result);
        `
        )
        d_input_div.appendChild(driverT2);

        var driverT3 = document.createElement('input');
        driverT3.setAttribute('id', 'driverT3');
        driverT3.setAttribute('placeholder', 'driver T3');
        driverT3.setAttribute('type', 'number');
        driverT3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('driverT1').value/3) + (document.getElementById('driverT2').value)/3 + (document.getElementById('driverT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('driverT_avg').setAttribute('placeholder', result);
        `
        )
        d_input_div.appendChild(driverT3);

        var driverT_avg = document.createElement('input');
        driverT_avg.setAttribute('id', 'driverT_avg');
        driverT_avg.setAttribute('placeholder', 'DS TAvg');
        driverT_avg.disabled = true;
        d_input_div.appendChild(driverT_avg);      

        var d_input_div = document.createElement('div');
        d_input_div.setAttribute('id', 'driverB_side');
        testdata.appendChild(d_input_div);

        var driverB1 = document.createElement('input');
        driverB1.setAttribute('id', 'driverB1');
        driverB1.setAttribute('placeholder', 'driver B1');
        driverB1.setAttribute('type', 'number');
        driverB1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('driverB1').value/3) + (document.getElementById('driverB2').value)/3 + (document.getElementById('driverB3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('driverB_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('driverB1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('driverB_avg').setAttribute('placeholder', result);
            }
            `
        )
        d_input_div.appendChild(driverB1);

        var driverB2 = document.createElement('input');
        driverB2.setAttribute('id', 'driverB2');
        driverB2.setAttribute('placeholder', 'driver B2');
        driverB2.setAttribute('type', 'number');
        driverB2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('driverB1').value/3) + (document.getElementById('driverB2').value)/3 + (document.getElementById('driverB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('driverB_avg').setAttribute('placeholder', result);
        `
        )
        d_input_div.appendChild(driverB2);

        var driverB3 = document.createElement('input');
        driverB3.setAttribute('id', 'driverB3');
        driverB3.setAttribute('placeholder', 'driver B3');
        driverB3.setAttribute('type', 'number');
        driverB3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('driverB1').value/3) + (document.getElementById('driverB2').value)/3 + (document.getElementById('driverB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('driverB_avg').setAttribute('placeholder', result);
        `
        )
        d_input_div.appendChild(driverB3);

        var driverB_avg = document.createElement('input');
        driverB_avg.setAttribute('id', 'driverB_avg');
        driverB_avg.setAttribute('placeholder', 'DS BAvg');
        driverB_avg.disabled = true;
        d_input_div.appendChild(driverB_avg);  
        
        function empty_count(element){
            var num_empty = 0;
            if (element.textContext.trim() === ""){
                num_empty = num_empty+1;
            }
            return num_empty
        }

        var data_button_div = document.createElement('div');
        data_button_div.setAttribute('id', 'databutton');
        datafield.appendChild(data_button_div);

        var create_report = document.createElement('button');
        create_report.setAttribute('id', 'createreport');
        create_report.innerHTML = "Save & Report";
        create_report.setAttribute('onclick', 
        `
        var id_list = ['date', 'type', 'start', 'finish', 'comment', 'samplingdate', 'testpointtype', 'basetype','bmt', 'blankT1', 'blankT2', 'blankT3', 'blankB1', 'blankB2', 'blankB3', 'operatorT1', 'operatorT2', 'operatorT3', 'operatorB1', 'operatorB2', 'operatorB3', 'middleT1', 'middleT2', 'middleT3', 'middleB1', 'middleB2', 'middleB3', 'driverT1', 'driverT2', 'driverT3', 'driverB1', 'driverB2', 'driverB3']
        var avg_list = ['blankT_avg','blankB_avg', 'operatorT_avg', 'operatorB_avg', 'middleT_avg', 'middleB_avg', 'driverT_avg', 'driverB_avg']
        var jump_col = 3;
        var value_list = [];
        var empty_count = 0;
        for (let i=0; i< id_list.length; i++){
            value_list.push(document.getElementById(id_list[i]).value);
        };
        for (let i=0; i< avg_list.length; i++){
            value_list.push(document.getElementById(avg_list[i]).getAttribute('placeholder'));
        };
        for (let i=0; i< jump_col; i++){
            value_list.push('');
        };
        if (person === 0){
            var sign_person = require('./signinperson.json');
            const lastperson = lastPerson(sign_person);
            value_list.push(lastperson);
        }
        else if (person === 1){
            value_list.push(document.getElementById('byother').value);
        }
        for (let i=0; i<value_list.length;i++){
            if (value_list[i] === ""){
                empty_count = empty_count + 1;
            }
        }
    
        if ((document.getElementById('testpointtype').value === "1time Test(O-M-D)" && empty_count <= 20) ||(document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)" && empty_count <= 4) ){
            
            google.save_data(worksheetId, value_list);

            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            
            dialogs.prompt("Data are Saved to Database!!! Any remark to include in report?", "", ok => {
                report.create_pretreat_report(person, "./resources/app/CPL_Pretreatment_Reports/", ok)

                dialogs.alert("See your report in 'CPL_Pretreatment_Report' folder.")

                document.getElementById('refresh').click();
            })            
        }
        else {
            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            dialogs.alert("Some Values are Missing!!! Double Check Please!!!")
        }

        `
        )
        data_button_div.appendChild(create_report);

        var save_input = document.createElement('button');
        save_input.setAttribute('id', 'save');
        save_input.innerHTML = "Save";
        save_input.setAttribute("onclick", 
        `
        var id_list = ['date', 'type', 'start', 'finish', 'comment', 'samplingdate', 'testpointtype', 'basetype','bmt', 'blankT1', 'blankT2', 'blankT3', 'blankB1', 'blankB2', 'blankB3', 'operatorT1', 'operatorT2', 'operatorT3', 'operatorB1', 'operatorB2', 'operatorB3', 'middleT1', 'middleT2', 'middleT3', 'middleB1', 'middleB2', 'middleB3', 'driverT1', 'driverT2', 'driverT3', 'driverB1', 'driverB2', 'driverB3']
        var avg_list = ['blankT_avg','blankB_avg', 'operatorT_avg', 'operatorB_avg', 'middleT_avg', 'middleB_avg', 'driverT_avg', 'driverB_avg']
        var jump_col = 3;
        var value_list = [];
        var empty_count = 0;
        for (let i=0; i< id_list.length; i++){
            value_list.push(document.getElementById(id_list[i]).value);
        };
        for (let i=0; i< avg_list.length; i++){
            value_list.push(document.getElementById(avg_list[i]).getAttribute('placeholder'));
        };
        for (let i=0; i< jump_col; i++){
            value_list.push('');
        };
        if (person === 0){
            var sign_person = require('./signinperson.json');
            const lastperson = lastPerson(sign_person);
            value_list.push(lastperson);
        }
        else if (person === 1){
            value_list.push(document.getElementById('byother').value);
        }
        for (let i=0; i<value_list.length;i++){
            if (value_list[i] === ""){
                empty_count = empty_count + 1;
            }
        }
    
        if ((document.getElementById('testpointtype').value === "1time Test(O-M-D)" && empty_count <= 20) ||(document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)" && empty_count <= 4) ){
            google.save_data(worksheetId, value_list)
            
            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            dialogs.alert("Data Uploaded!!!")

            document.getElementById('refresh').click();
        }
        else {
            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            dialogs.alert("Some Values are Missing!!! Double Check Please!!!")
        }
        `
        )
        data_button_div.appendChild(save_input);

        var refresh = document.createElement('button');
        refresh.setAttribute('id', 'refresh');
        refresh.innerHTML = "Refresh Input";
        refresh.setAttribute('onclick', 
        `
        var refresh_field = document.getElementById('datasection');
        refresh_field.innerHTML = refresh_field.innerHTML;
        `)
        data_button_div.appendChild(refresh);

        datasection.innerHTML = datafield.innerHTML;
    };

    if (samptype.value == "MCL Pretreatment") {

        var datafield = document.createElement('div');
        datafield.setAttribute('id', 'datafield');

        datafield.style.width = '50%';
        datafield.style.boxShadow =  '0px 0px 5px #fff';
        datafield.style.borderRadius = '20px';
        //Create title for data field
        var label1 = document.createElement("label");
        label1.innerHTML = "Please Enter Test Data:";
        datafield.appendChild(label1);
        
        var samplingdate = document.createElement('input');
        samplingdate.setAttribute('id', 'samplingdate');
        samplingdate.placeholder = 'Enter Sampling Date';
        samplingdate.setAttribute('onblur', "(this.type = 'text')");
        samplingdate.setAttribute('onfocus', "(this.type = 'date')");
        datafield.appendChild(samplingdate);
        
        //Create array of options to be added
        var array = ["3times Test(O3-M3-D3)","1time Test(O-M-D)"];

        
        //Create and append select list
        var testpoint = document.createElement("select");
        testpoint.setAttribute("id", "testpointtype");
        //Create and append the options
        for (var i = 0; i < array.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value", array[i]);
            option.text = array[i];
            testpoint.appendChild(option);
        };
        
        testpoint.setAttribute("onchange",
        `
        if(this.value === "1time Test(O-M-D)") {
            disable_array = ['blankT2', 'blankT3', 'blankB2', 'blankB3','operatorT2', 'operatorT3', 'operatorB2', 'operatorB3', 'middleT2', 'middleT3','middleB2','middleB3', 'driverT2', 'driverT3', 'driverB2', 'driverB3'];
            
            for(let i=0; i<disable_array.length; i++){
                document.getElementById(disable_array[i]).disabled = true;
                document.getElementById(disable_array[i]).value = "";
                document.getElementById('blankT1').value = "";
                document.getElementById('operatorT1').value = "";
                document.getElementById('middleT1').value = "";
                document.getElementById('driverT1').value = "";
                document.getElementById('blankB1').value = "";
                document.getElementById('operatorB1').value = "";
                document.getElementById('middleB1').value = "";
                document.getElementById('driverB1').value = "";
            }
        }
        else if (this.value === "3times Test(O3-M3-D3)"){
            disable_array = ['blankT2', 'blankT3', 'blankB2', 'blankB3','operatorT2', 'operatorT3', 'operatorB2', 'operatorB3', 'middleT2', 'middleT3','middleB2','middleB3', 'driverT2', 'driverT3', 'driverB2', 'driverB3'];
            for(let i=0; i<disable_array.length; i++){
                document.getElementById(disable_array[i]).disabled = false;
            }
        };
        `)
        datafield.appendChild(testpoint);

        //Create and append select list
        var basetype = document.createElement("select");
        basetype.setAttribute("id", "basetype");
        datafield.appendChild(basetype);
        
        var b_option = ['GL(35~45mg/m^2)', 'GI(25~35mg/m^2)'];
        //Create and append the options
        for (var i = 0; i < array.length; i++) {
            var base_option = document.createElement("option");
            base_option.setAttribute("value", b_option[i]);
            base_option.text = b_option[i];
            basetype.appendChild(base_option);
        };

        //Create and append select list
        var bmt = document.createElement("select");
        bmt.setAttribute("id", "bmt");
        datafield.appendChild(bmt);
        
        var bmt_option = ['BMT(NIL)', '0.25mm', '0.30mm', '0.35mm', '0.38mm', '0.40mm', '0.42mm', '0.46mm'];

        //Create and append the options
        for (var i = 0; i < bmt_option.length; i++) {
            var bmtoption = document.createElement("option");
            bmtoption.setAttribute("value", bmt_option[i]);
            bmtoption.text = bmt_option[i];
            bmt.appendChild(bmtoption);
        };

        var testdata = document.createElement('div');
        testdata.setAttribute('id', 'testdata');
        datafield.appendChild(testdata);

        var blankT_div = document.createElement('div');
        blankT_div.setAttribute('id', 'operator_side');
        testdata.appendChild(blankT_div);
        
        var blankT1 = document.createElement('input');
        blankT1.setAttribute('id', 'blankT1');
        blankT1.setAttribute('placeholder', 'blank T1');
        blankT1.setAttribute('type', 'number');
        blankT1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('blankT1').value/3) + (document.getElementById('blankT2').value)/3 + (document.getElementById('blankT3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('blankT_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('blankT1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('blankT_avg').setAttribute('placeholder', result);
            }
            `
        )
        blankT_div.appendChild(blankT1);

        var blankT2 = document.createElement('input');
        blankT2.setAttribute('id', 'blankT2');
        blankT2.setAttribute('placeholder', 'blank T2');
        blankT2.setAttribute('type', 'number');
        blankT2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('blankT1').value/3) + (document.getElementById('blankT2').value)/3 + (document.getElementById('blankT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('blankT_avg').setAttribute('placeholder', result);
        `);
        blankT_div.appendChild(blankT2);

        var blankT3 = document.createElement('input');
        blankT3.setAttribute('id', 'blankT3');
        blankT3.setAttribute('placeholder', 'blank T3');
        blankT3.setAttribute('type', 'number');
        blankT3.setAttribute('onchange',
        `
        var avg = (document.getElementById('blankT1').value/3) + (document.getElementById('blankT2').value)/3 + (document.getElementById('blankT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('blankT_avg').setAttribute('placeholder', result);
        `
        )
        blankT_div.appendChild(blankT3);

        var blankT_avg = document.createElement('input');
        blankT_avg.setAttribute('id', 'blankT_avg');
        blankT_avg.setAttribute('placeholder', 'blank TAvg');
        blankT_avg.disabled = true;
        blankT_div.appendChild(blankT_avg);

        var blankB_div = document.createElement('div');
        blankB_div.setAttribute('id', 'operator_side');
        testdata.appendChild(blankB_div);
        
        var blankB1 = document.createElement('input');
        blankB1.setAttribute('id', 'blankB1');
        blankB1.setAttribute('placeholder', 'blank B1');
        blankB1.setAttribute('type', 'number');
        blankB1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('blankB1').value/3) + (document.getElementById('blankB2').value)/3 + (document.getElementById('blankB3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('blankB_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('blankB1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('blankB_avg').setAttribute('placeholder', result);
            }
            `
        )
        blankB_div.appendChild(blankB1);

        var blankB2 = document.createElement('input');
        blankB2.setAttribute('id', 'blankB2');
        blankB2.setAttribute('placeholder', 'blank B2');
        blankB2.setAttribute('type', 'number');
        blankB2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('blankB1').value/3) + (document.getElementById('blankB2').value)/3 + (document.getElementById('blankB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('blankB_avg').setAttribute('placeholder', result);
        `);
        blankB_div.appendChild(blankB2);

        var blankB3 = document.createElement('input');
        blankB3.setAttribute('id', 'blankB3');
        blankB3.setAttribute('placeholder', 'blank B3');
        blankB3.setAttribute('type', 'number');
        blankB3.setAttribute('onchange',
        `
        var avg = (document.getElementById('blankB1').value/3) + (document.getElementById('blankB2').value)/3 + (document.getElementById('blankB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('blankB_avg').setAttribute('placeholder', result);
        `
        )
        blankB_div.appendChild(blankB3);

        var blankB_avg = document.createElement('input');
        blankB_avg.setAttribute('id', 'blankB_avg');
        blankB_avg.setAttribute('placeholder', 'blank BAvg');
        blankB_avg.disabled = true;
        blankB_div.appendChild(blankB_avg);

        var o_input_div = document.createElement('div');
        o_input_div.setAttribute('id', 'operatorT_side');
        testdata.appendChild(o_input_div);

        var operatorT1 = document.createElement('input');
        operatorT1.setAttribute('id', 'operatorT1');
        operatorT1.setAttribute('placeholder', 'operator T1');
        operatorT1.setAttribute('type', 'number');
        operatorT1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('operatorT1').value/3) + (document.getElementById('operatorT2').value)/3 + (document.getElementById('operatorT3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('operatorT_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('operatorT1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('operatorT_avg').setAttribute('placeholder', result);
            }
            `
        )
        o_input_div.appendChild(operatorT1);

        var operatorT2 = document.createElement('input');
        operatorT2.setAttribute('id', 'operatorT2');
        operatorT2.setAttribute('placeholder', 'operator T2');
        operatorT2.setAttribute('type', 'number');
        operatorT2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('operatorT1').value/3) + (document.getElementById('operatorT2').value)/3 + (document.getElementById('operatorT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('operatorT_avg').setAttribute('placeholder', result);
        `
        )
        o_input_div.appendChild(operatorT2);

        var operatorT3 = document.createElement('input');
        operatorT3.setAttribute('id', 'operatorT3');
        operatorT3.setAttribute('placeholder', 'operator T3');
        operatorT3.setAttribute('type', 'number');
        operatorT3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('operatorT1').value/3) + (document.getElementById('operatorT2').value)/3 + (document.getElementById('operatorT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('operatorT_avg').setAttribute('placeholder', result);
        `
        )
        o_input_div.appendChild(operatorT3);

        var operatorT_avg = document.createElement('input');
        operatorT_avg.setAttribute('id', 'operatorT_avg');
        operatorT_avg.setAttribute('placeholder', 'OS TAvg');
        operatorT_avg.disabled = true;
        o_input_div.appendChild(operatorT_avg);

        
        var o_input_div = document.createElement('div');
        o_input_div.setAttribute('id', 'operatorB_side');
        testdata.appendChild(o_input_div);

        var operatorB1 = document.createElement('input');
        operatorB1.setAttribute('id', 'operatorB1');
        operatorB1.setAttribute('placeholder', 'operator B1');
        operatorB1.setAttribute('type', 'number');
        operatorB1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('operatorB1').value/3) + (document.getElementById('operatorB2').value)/3 + (document.getElementById('operatorB3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('operatorB_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('operatorB1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('operatorB_avg').setAttribute('placeholder', result);
            }
            `
        )
        o_input_div.appendChild(operatorB1);

        var operatorB2 = document.createElement('input');
        operatorB2.setAttribute('id', 'operatorB2');
        operatorB2.setAttribute('placeholder', 'operator B2');
        operatorB2.setAttribute('type', 'number');
        operatorB2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('operatorB1').value/3) + (document.getElementById('operatorB2').value)/3 + (document.getElementById('operatorB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('operatorB_avg').setAttribute('placeholder', result);
        `
        )
        o_input_div.appendChild(operatorB2);

        var operatorB3 = document.createElement('input');
        operatorB3.setAttribute('id', 'operatorB3');
        operatorB3.setAttribute('placeholder', 'operator B3');
        operatorB3.setAttribute('type', 'number');
        operatorB3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('operatorB1').value/3) + (document.getElementById('operatorB2').value)/3 + (document.getElementById('operatorB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('operatorB_avg').setAttribute('placeholder', result);
        `
        )
        o_input_div.appendChild(operatorB3);

        var operatorB_avg = document.createElement('input');
        operatorB_avg.setAttribute('id', 'operatorB_avg');
        operatorB_avg.setAttribute('placeholder', 'OS BAvg');
        operatorB_avg.disabled = true;
        o_input_div.appendChild(operatorB_avg);

        var m_input_div = document.createElement('div');
        m_input_div.setAttribute('id', 'middleT');
        testdata.appendChild(m_input_div);

        var middleT1 = document.createElement('input');
        middleT1.setAttribute('id', 'middleT1');
        middleT1.setAttribute('placeholder', 'middle T1');
        middleT1.setAttribute('type', 'number');
        middleT1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('middleT1').value/3) + (document.getElementById('middleT2').value)/3 + (document.getElementById('middleT3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('middleT_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('middleT1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('middleT_avg').setAttribute('placeholder', result);
            }
            `
        )
        m_input_div.appendChild(middleT1);

        var middleT2 = document.createElement('input');
        middleT2.setAttribute('id', 'middleT2');
        middleT2.setAttribute('placeholder', 'middle T2');
        middleT2.setAttribute('type', 'number');
        middleT2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('middleT1').value/3) + (document.getElementById('middleT2').value)/3 + (document.getElementById('middleT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('middleT_avg').setAttribute('placeholder', result);
        `
        )
        m_input_div.appendChild(middleT2);

        var middleT3 = document.createElement('input');
        middleT3.setAttribute('id', 'middleT3');
        middleT3.setAttribute('placeholder', 'middle T3');
        middleT3.setAttribute('type', 'number');
        middleT3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('middleT1').value/3) + (document.getElementById('middleT2').value)/3 + (document.getElementById('middleT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('middleT_avg').setAttribute('placeholder', result);
        `
        )
        m_input_div.appendChild(middleT3);
        
        var middleT_avg = document.createElement('input');
        middleT_avg.setAttribute('id', 'middleT_avg');
        middleT_avg.setAttribute('placeholder', 'MS TAvg');
        middleT_avg.disabled = true;
        m_input_div.appendChild(middleT_avg);

        var m_input_div = document.createElement('div');
        m_input_div.setAttribute('id', 'middleB');
        testdata.appendChild(m_input_div);

        var middleB1 = document.createElement('input');
        middleB1.setAttribute('id', 'middleB1');
        middleB1.setAttribute('placeholder', 'middle B1');
        middleB1.setAttribute('type', 'number');
        middleB1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('middleB1').value/3) + (document.getElementById('middleB2').value)/3 + (document.getElementById('middleB3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('middleB_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('middleB1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('middleB_avg').setAttribute('placeholder', result);
            }
            `
        )
        m_input_div.appendChild(middleB1);

        var middleB2 = document.createElement('input');
        middleB2.setAttribute('id', 'middleB2');
        middleB2.setAttribute('placeholder', 'middle B2');
        middleB2.setAttribute('type', 'number');
        middleB2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('middleB1').value/3) + (document.getElementById('middleB2').value)/3 + (document.getElementById('middleB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('middleB_avg').setAttribute('placeholder', result);
        `
        )
        m_input_div.appendChild(middleB2);

        var middleB3 = document.createElement('input');
        middleB3.setAttribute('id', 'middleB3');
        middleB3.setAttribute('placeholder', 'middle B3');
        middleB3.setAttribute('type', 'number');
        middleB3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('middleB1').value/3) + (document.getElementById('middleB2').value)/3 + (document.getElementById('middleB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('middleB_avg').setAttribute('placeholder', result);
        `
        )
        m_input_div.appendChild(middleB3);
        
        var middleB_avg = document.createElement('input');
        middleB_avg.setAttribute('id', 'middleB_avg');
        middleB_avg.setAttribute('placeholder', 'MS BAvg');
        middleB_avg.disabled = true;
        m_input_div.appendChild(middleB_avg);

        var d_input_div = document.createElement('div');
        d_input_div.setAttribute('id', 'driverT_side');
        testdata.appendChild(d_input_div);

        var driverT1 = document.createElement('input');
        driverT1.setAttribute('id', 'driverT1');
        driverT1.setAttribute('placeholder', 'driver T1');
        driverT1.setAttribute('type', 'number');
        driverT1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('driverT1').value/3) + (document.getElementById('driverT2').value)/3 + (document.getElementById('driverT3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('driverT_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('driverT1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('driverT_avg').setAttribute('placeholder', result);
            }
            `
        )
        d_input_div.appendChild(driverT1);

        var driverT2 = document.createElement('input');
        driverT2.setAttribute('id', 'driverT2');
        driverT2.setAttribute('placeholder', 'driver T2');
        driverT2.setAttribute('type', 'number');
        driverT2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('driverT1').value/3) + (document.getElementById('driverT2').value)/3 + (document.getElementById('driverT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('driverT_avg').setAttribute('placeholder', result);
        `
        )
        d_input_div.appendChild(driverT2);

        var driverT3 = document.createElement('input');
        driverT3.setAttribute('id', 'driverT3');
        driverT3.setAttribute('placeholder', 'driver T3');
        driverT3.setAttribute('type', 'number');
        driverT3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('driverT1').value/3) + (document.getElementById('driverT2').value)/3 + (document.getElementById('driverT3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('driverT_avg').setAttribute('placeholder', result);
        `
        )
        d_input_div.appendChild(driverT3);

        var driverT_avg = document.createElement('input');
        driverT_avg.setAttribute('id', 'driverT_avg');
        driverT_avg.setAttribute('placeholder', 'DS TAvg');
        driverT_avg.disabled = true;
        d_input_div.appendChild(driverT_avg);      

        var d_input_div = document.createElement('div');
        d_input_div.setAttribute('id', 'driverB_side');
        testdata.appendChild(d_input_div);

        var driverB1 = document.createElement('input');
        driverB1.setAttribute('id', 'driverB1');
        driverB1.setAttribute('placeholder', 'driver B1');
        driverB1.setAttribute('type', 'number');
        driverB1.setAttribute('onchange', 
            `
            if (document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)"){
                var avg = (document.getElementById('driverB1').value/3) + (document.getElementById('driverB2').value)/3 + (document.getElementById('driverB3').value)/3;
                var result = avg.toFixed(2).toString() + " mg/m^2";
                document.getElementById('driverB_avg').setAttribute('placeholder', result);
            }
            else if (document.getElementById('testpointtype').value === "1time Test(O-M-D)"){
                var val = document.getElementById('driverB1').value.toString();
                var val_fixed = parseFloat(val).toFixed(2);
                var result = val_fixed.toString() + " mg/m^2";
                document.getElementById('driverB_avg').setAttribute('placeholder', result);
            }
            `
        )
        d_input_div.appendChild(driverB1);

        var driverB2 = document.createElement('input');
        driverB2.setAttribute('id', 'driverB2');
        driverB2.setAttribute('placeholder', 'driver B2');
        driverB2.setAttribute('type', 'number');
        driverB2.setAttribute('onchange', 
        `
        var avg = (document.getElementById('driverB1').value/3) + (document.getElementById('driverB2').value)/3 + (document.getElementById('driverB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('driverB_avg').setAttribute('placeholder', result);
        `
        )
        d_input_div.appendChild(driverB2);

        var driverB3 = document.createElement('input');
        driverB3.setAttribute('id', 'driverB3');
        driverB3.setAttribute('placeholder', 'driver B3');
        driverB3.setAttribute('type', 'number');
        driverB3.setAttribute('onchange', 
        `
        var avg = (document.getElementById('driverB1').value/3) + (document.getElementById('driverB2').value)/3 + (document.getElementById('driverB3').value)/3;
        var result = avg.toFixed(2).toString() + " mg/m^2";
        document.getElementById('driverB_avg').setAttribute('placeholder', result);
        `
        )
        d_input_div.appendChild(driverB3);

        var driverB_avg = document.createElement('input');
        driverB_avg.setAttribute('id', 'driverB_avg');
        driverB_avg.setAttribute('placeholder', 'DS BAvg');
        driverB_avg.disabled = true;
        d_input_div.appendChild(driverB_avg);  
        
        function empty_count(element){
            var num_empty = 0;
            if (element.textContext.trim() === ""){
                num_empty = num_empty+1;
            }
            return num_empty
        }

        var data_button_div = document.createElement('div');
        data_button_div.setAttribute('id', 'databutton');
        datafield.appendChild(data_button_div);

        var create_report = document.createElement('button');
        create_report.setAttribute('id', 'createreport');
        create_report.innerHTML = "Save & Report";
        create_report.setAttribute('onclick', 
        `
        var id_list = ['date', 'type', 'start', 'finish', 'comment', 'samplingdate', 'testpointtype', 'basetype','bmt', 'blankT1', 'blankT2', 'blankT3', 'blankB1', 'blankB2', 'blankB3', 'operatorT1', 'operatorT2', 'operatorT3', 'operatorB1', 'operatorB2', 'operatorB3', 'middleT1', 'middleT2', 'middleT3', 'middleB1', 'middleB2', 'middleB3', 'driverT1', 'driverT2', 'driverT3', 'driverB1', 'driverB2', 'driverB3']
        var avg_list = ['blankT_avg','blankB_avg', 'operatorT_avg', 'operatorB_avg', 'middleT_avg', 'middleB_avg', 'driverT_avg', 'driverB_avg']
        var jump_col = 3;
        var value_list = [];
        var empty_count = 0;
        for (let i=0; i< id_list.length; i++){
            value_list.push(document.getElementById(id_list[i]).value);
        };
        for (let i=0; i< avg_list.length; i++){
            value_list.push(document.getElementById(avg_list[i]).getAttribute('placeholder'));
        };
        for (let i=0; i< jump_col; i++){
            value_list.push('');
        };
        if (person === 0){
            var sign_person = require('./signinperson.json');
            const lastperson = lastPerson(sign_person);
            value_list.push(lastperson);
        }
        else if (person === 1){
            value_list.push(document.getElementById('byother').value);
        }
        for (let i=0; i<value_list.length;i++){
            if (value_list[i] === ""){
                empty_count = empty_count + 1;
            }
        }
    
        if ((document.getElementById('testpointtype').value === "1time Test(O-M-D)" && empty_count <= 20) ||(document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)" && empty_count <= 4) ){
            
            google.save_data(worksheetId, value_list);

            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            
            dialogs.prompt("Data are Saved to Database!!! Any remark to include in report?", "", ok => {
                report.create_pretreat_report(person, "./resources/app/MCL_Pretreatment_Reports/", ok)

                dialogs.alert("See your report in 'MCL_Pretreatment_Report' folder.")

                document.getElementById('refresh').click();
            })
        }
        else {
            
            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            dialogs.alert("Some Values are Missing!!! Double Check Please!!!")
            
        }

        `
        )
        data_button_div.appendChild(create_report);

        var save_input = document.createElement('button');
        save_input.setAttribute('id', 'save');
        save_input.innerHTML = "Save";
        save_input.setAttribute("onclick", 
        `
        var id_list = ['date', 'type', 'start', 'finish', 'comment', 'samplingdate', 'testpointtype', 'basetype','bmt', 'blankT1', 'blankT2', 'blankT3', 'blankB1', 'blankB2', 'blankB3', 'operatorT1', 'operatorT2', 'operatorT3', 'operatorB1', 'operatorB2', 'operatorB3', 'middleT1', 'middleT2', 'middleT3', 'middleB1', 'middleB2', 'middleB3', 'driverT1', 'driverT2', 'driverT3', 'driverB1', 'driverB2', 'driverB3']
        var avg_list = ['blankT_avg','blankB_avg', 'operatorT_avg', 'operatorB_avg', 'middleT_avg', 'middleB_avg', 'driverT_avg', 'driverB_avg']
        var jump_col = 3;
        var value_list = [];
        var empty_count = 0;
        for (let i=0; i< id_list.length; i++){
            value_list.push(document.getElementById(id_list[i]).value);
        };
        for (let i=0; i< avg_list.length; i++){
            value_list.push(document.getElementById(avg_list[i]).getAttribute('placeholder'));
        };
        for (let i=0; i< jump_col; i++){
            value_list.push('');
        };
        if (person === 0){
            var sign_person = require('./signinperson.json');
            const lastperson = lastPerson(sign_person);
            value_list.push(lastperson);
        }
        else if (person === 1){
            value_list.push(document.getElementById('byother').value);
        }
        for (let i=0; i<value_list.length;i++){
            if (value_list[i] === ""){
                empty_count = empty_count + 1;
            }
        }
    
        if ((document.getElementById('testpointtype').value === "1time Test(O-M-D)" && empty_count <= 20) ||(document.getElementById('testpointtype').value === "3times Test(O3-M3-D3)" && empty_count <= 4) ){
            google.save_data(worksheetId, value_list)

            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            dialogs.alert("Data are Saved to Database!!!")

            document.getElementById('refresh').click();
        }
        else {
            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            dialogs.alert("Some Values are Missing!!! Double Check Please!!!")
        }
        `
        )
        data_button_div.appendChild(save_input);

        var refresh = document.createElement('button');
        refresh.setAttribute('id', 'refresh');
        refresh.innerHTML = "Refresh Input";
        refresh.setAttribute('onclick', 
        `
        ipc.send('show-testledgerentry');
        var refresh_field = document.getElementById('datasection');
        refresh_field.innerHTML = refresh_field.innerHTML;
        `)
        data_button_div.appendChild(refresh);

        datasection.innerHTML = datafield.innerHTML;
    };

    if (samptype.value == "Non Standard XRF"){

        var datafield = document.createElement('div');
        datafield.setAttribute('id', 'datafield');

        datafield.style.width = '50%';
        datafield.style.boxShadow =  '0px 0px 5px #fff';
        datafield.style.borderRadius = '20px';
        //Create title for data field
        var label1 = document.createElement("label");
        label1.innerHTML = "Please Enter Test Sample Data.";
        datafield.appendChild(label1);
        
        var samplingdate = document.createElement('input');
        samplingdate.setAttribute('id', 'samplingdate');
        samplingdate.placeholder = 'Enter Sampling Date';
        samplingdate.setAttribute('onblur', "(this.type = 'text')");
        samplingdate.setAttribute('onfocus', "(this.type = 'date')");
        datafield.appendChild(samplingdate);
        
        //Create array of options to be added
        var depart_array = ["Products and Technical Services", "Color Painting Line", "Metal Coating Line", "Waste Water Treatment Plant"];

        //Create and append select list
        var department = document.createElement("select");
        department.setAttribute("id", "department");
        //Create and append the options
        for (var i = 0; i < depart_array.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value", depart_array[i]);
            option.text = depart_array[i];
            department.appendChild(option);
        };

        datafield.appendChild(department);

        //Create and append select list
        var purpose = document.createElement("input");
        purpose.setAttribute("id", "purpose");
        purpose.setAttribute("placeholder", "Purpose of Testing")
        datafield.appendChild(purpose);
        

        var num_sample = document.createElement('input');
        num_sample.setAttribute('id', 'num_sample');
        num_sample.setAttribute("placeholder", "Number of Sample Testing.")

        datafield.appendChild(num_sample);    

        var data_button_div = document.createElement('div');
        data_button_div.setAttribute('id', 'databutton');
        datafield.appendChild(data_button_div);

        var create_report = document.createElement('button');
        create_report.setAttribute('id', 'createreport');
        create_report.innerHTML = "Save & Report";
        create_report.setAttribute('onclick', 
        `
        const Dialogs = require('dialogs');
        const dialogs = Dialogs()
        dialogs.alert('Due to custom requirement of graph and layout, no built in report creation for this section.');
        document.getElementById('save').click();
        `)
        data_button_div.appendChild(create_report);

        var save_input = document.createElement('button');
        save_input.setAttribute('id', 'save');
        save_input.innerHTML = "Save";
        save_input.setAttribute('onclick', 
        `
        var id_list = ['date', 'type', 'start', 'finish', 'comment', 'samplingdate'];
        var jump_col = 35;
        var rest_id = ['department', 'purpose', 'num_sample']
        var value_list = [];
        var empty_count = 0;
        for (let i=0; i< id_list.length; i++){
            value_list.push(document.getElementById(id_list[i]).value);
        };
        for (let i=0; i< jump_col; i++){
            value_list.push('');
        };
        for (let i=0; i< rest_id.length; i++){
            value_list.push(document.getElementById(rest_id[i]).value);
        }
        if (person === 0){
            var sign_person = require('./signinperson.json');
            const lastperson = lastPerson(sign_person);
            value_list.push(lastperson);
        }
        else if (person === 1){
            value_list.push(document.getElementById('byother').value);
        }
        for (let i=0; i<value_list.length;i++){
            if (value_list[i] === ""){
                empty_count = empty_count + 1;
            }
        };
        if (empty_count <= 36){
            google.save_data(worksheetId, value_list);
            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            dialogs.alert("Data are Saved to Database!!!")
            document.getElementById('refresh').click();
        }
        else {
            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            dialogs.alert("Some Values are Missing!!! Double Check Please!!!");
        }
        `)
        data_button_div.appendChild(save_input);

        var refresh = document.createElement('button');
        refresh.setAttribute('id', 'refresh');
        refresh.innerHTML = "Refresh Input";
        refresh.setAttribute('onclick',
        `
        ipc.send('show-testledgerentry');
        var refresh_field = document.getElementById('datasection');
        refresh_field.innerHTML = refresh_field.innerHTML;
        `)
        data_button_div.appendChild(refresh);
        datasection.innerHTML = datafield.innerHTML;
    }

    if (samptype.value == "Non Standard Microscope"){

        var datafield = document.createElement('div');
        datafield.setAttribute('id', 'datafield');

        datafield.style.width = '50%';
        datafield.style.boxShadow =  '0px 0px 5px #fff';
        datafield.style.borderRadius = '20px';
        //Create title for data field
        var label1 = document.createElement("label");
        label1.innerHTML = "Please Enter Test Sample Data.";
        datafield.appendChild(label1);
        
        var samplingdate = document.createElement('input');
        samplingdate.setAttribute('id', 'samplingdate');
        samplingdate.placeholder = 'Enter Sampling Date';
        samplingdate.setAttribute('onblur', "(this.type = 'text')");
        samplingdate.setAttribute('onfocus', "(this.type = 'date')");
        datafield.appendChild(samplingdate);
        
        //Create array of options to be added
        var depart_array = ["Products and Technical Services", "Color Painting Line", "Metal Coating Line", "Waste Water Treatment Plant"];

        //Create and append select list
        var department = document.createElement("select");
        department.setAttribute("id", "department");
        //Create and append the options
        for (var i = 0; i < depart_array.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value", depart_array[i]);
            option.text = depart_array[i];
            department.appendChild(option);
        };

        datafield.appendChild(department);

        //Create and append select list
        var purpose = document.createElement("input");
        purpose.setAttribute("id", "purpose");
        purpose.setAttribute("placeholder", "Purpose of Testing")
        datafield.appendChild(purpose);
        

        var num_sample = document.createElement('input');
        num_sample.setAttribute('id', 'num_sample');
        num_sample.setAttribute("placeholder", "Number of Sample Testing.")

        datafield.appendChild(num_sample);    

        var data_button_div = document.createElement('div');
        data_button_div.setAttribute('id', 'databutton');
        datafield.appendChild(data_button_div);

        var create_report = document.createElement('button');
        create_report.setAttribute('id', 'createreport');
        create_report.innerHTML = "Save & Report";
        create_report.setAttribute('onclick', 
        `
        const Dialogs = require('dialogs');
        const dialogs = Dialogs()
        dialogs.alert('Due to custom requirement of graph and layout, no built in report creation for this section.');
        document.getElementById('save').click();
        `)
        data_button_div.appendChild(create_report);

        var save_input = document.createElement('button');
        save_input.setAttribute('id', 'save');
        save_input.innerHTML = "Save";
        save_input.setAttribute('onclick', 
        `
        var id_list = ['date', 'type', 'start', 'finish', 'comment', 'samplingdate'];
        var jump_col = 35;
        var rest_id = ['department', 'purpose', 'num_sample']
        var value_list = [];
        var empty_count = 0;
        for (let i=0; i< id_list.length; i++){
            value_list.push(document.getElementById(id_list[i]).value);
        };
        for (let i=0; i< jump_col; i++){
            value_list.push('');
        };
        for (let i=0; i< rest_id.length; i++){
            value_list.push(document.getElementById(rest_id[i]).value);
        }
        if (person === 0){
            var sign_person = require('./signinperson.json');
            const lastperson = lastPerson(sign_person);
            value_list.push(lastperson);
        }
        else if (person === 1){
            value_list.push(document.getElementById('byother').value);
        }
        for (let i=0; i<value_list.length;i++){
            if (value_list[i] === ""){
                empty_count = empty_count + 1;
            }
        };
        if (empty_count <= 36){
            google.save_data(worksheetId, value_list);
            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            dialogs.alert("Data are Saved to Database!!!")
            document.getElementById('refresh').click();
        }
        else {
            const Dialogs = require('dialogs');
            const dialogs = Dialogs();
            dialogs.alert("Some Values are Missing!!! Double Check Please!!!");
        }
        `)
        data_button_div.appendChild(save_input);

        var refresh = document.createElement('button');
        refresh.setAttribute('id', 'refresh');
        refresh.innerHTML = "Refresh Input";
        refresh.setAttribute('onclick',
        `
        ipc.send('show-testledgerentry');
        var refresh_field = document.getElementById('datasection');
        refresh_field.innerHTML = refresh_field.innerHTML;
        `)
        data_button_div.appendChild(refresh);

        datasection.innerHTML = datafield.innerHTML;
    }


});
