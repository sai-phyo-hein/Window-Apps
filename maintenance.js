const remote = require('electron').remote;
const BrowserWindow = require('electron').BrowserWindow;
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcRenderer;
const google = require('./google.js');
const report = require('./report.js');
const monthelymainte = require('./mainte/monthlymainte.json');
const preventivemainte = require('./mainte/preventivemainte.json');
const repair = require('./mainte/repair.json');

console.log(window.location.pathname.split('/'))
const Dialogs = require('dialogs');
const dialogs = Dialogs();

var mainte_type = document.getElementById('type');
mainte_type.addEventListener('change', function(event){
    if (document.getElementById('eq_name').value === ""){
        dialogs.alert("Please Select Equipment to Perform Maintenance.");
        this.value = "";

        var datafield = document.createElement('div');
        var lbl = document.createElement('p');
        lbl.innerHTML = "Select Equipment and Type of Maintenance."
        datafield.appendChild(lbl);

        var datasection = document.getElementById('datasection');
        datasection.innerHTML = datafield.innerHTML;

    }

    else if (document.getElementById('eq_name').value === "edxrf" && this.value === "weekly"){
        var datasection = document.getElementById('datasection');
        var datafield = document.createElement('div');
        var done_option = ['Undone', 'Done'];
        var done = 0;
        var clean_steps =[
            "# Make sure equipment is shut down............................................................................",
            "1. Clean the sample stage with dry cloth/ dry tissue (soft)...........................................",
            "2. Clean X-ray window with squeeze blower (no contact*).........................................",
            "3. Clean outer covers of equipment with dry cloth/ dry tissue (soft)...........................",
            "4. Clean table on which equipment sits. *Only quick volitile solvent are allowed......",
            "5. Check cables whether properly tied and arranged..................................................."
        ]
        for (let i=0; i<clean_steps.length; i++){
            var step = document.createElement('div');
            step.setAttribute('id','step');
            var step_label = document.createElement('label');
            step_label.innerHTML = clean_steps[i]
            step.appendChild(step_label);
            

            var step_check = document.createElement('select');
            var step_id = "step_check" + JSON.stringify(i);
            
            step_check.setAttribute('id', step_id);
            
            for (let i = 0; i< done_option.length; i++){
                var option = document.createElement('option');
                option.setAttribute('value', done_option[i]);
                option.text = done_option[i];
                step_check.appendChild(option)
            }
            step.appendChild(step_check);
            
            datafield.appendChild(step);
        }
        var step = document.createElement('div');
        step.setAttribute('id', 'step');
        var verif_label = document.createElement('label');
        verif_label.innerHTML = "6. Is there any case of Verification Error during this month?...........................";
        step.appendChild(verif_label);

        var ok_option = ["Select Status",'OK', "Error"]
        var step_check = document.createElement('select');
        
        step_check.setAttribute('id', "step_check6");
        for (let i = 0; i< ok_option.length; i++){
            var option = document.createElement('option');
            option.setAttribute('value', ok_option[i]);
            option.text = ok_option[i];
            step_check.appendChild(option)
        }
        step_check.setAttribute('onchange', 
        `
        if (this.value === "Error"){
            dialogs.alert("Please take screenshot/photo of error and inform to lab incharge with detail description.")
        }
        `
        )
        step.appendChild(step_check)
        datafield.appendChild(step);

        var comm = document.createElement('input');
        comm.setAttribute('id', "comment");
        comm.setAttribute('placeholder', "Comment/Remark")
        datafield.appendChild(comm)

        var btn_field = document.createElement('div');
        btn_field.setAttribute('id', 'btn_field')

        var proce_hard = document.createElement('button');
        proce_hard.setAttribute('id', 'proce_hard');
        proce_hard.innerHTML = "Print Form";
        btn_field.appendChild(proce_hard)

        var save = document.createElement('button');
        save.setAttribute('id', 'save');
        save.innerHTML = 'Save';
        save.setAttribute('onclick', 
        `
        var value_list = [];
        var empty = 0;
        var id_array = ['date', 'eq_name', 'type']
        for (let i=0; i < id_array.length; i++){
            if (document.getElementById(id_array[i]).value === ""){
                empty = empty + 1;
            }
        }
        for (let i=0; i<7; i++){
            var id = "step_check" + JSON.stringify(i);
            if (document.getElementById(id).value === "Undone" || document.getElementById(id).value === "Select Status" || document.getElementById(id).value === ""){
                empty = empty + 1;
            }
        }
        if (empty > 0){
            dialogs.alert("Some Values Are Missing!!! Double Check Please.")
        }
        else{
            const weeklymainte = require('./mainte/weeklymainte.json');
            for (let i = 0; i < weeklymainte.length; i++){
                if (weeklymainte[i].Name === document.getElementById('eq_name').value){
                    weeklymainte[i].Date = document.getElementById('date').value;
                    weeklymainte[i].Status = document.getElementById('step_check6').value;
                    break;
                }
            }

            var saving_data = JSON.stringify(weeklymainte);
            const fs = require('fs');
            fs.writeFile('./resources/app/mainte/weeklymainte.json', saving_data, err => {
                if (err) throw err;
            });
            console.log(weeklymainte)
            value_list.push(document.getElementById('date').value)
            value_list.push(document.getElementById('eq_name').value)
            value_list.push(document.getElementById('type').value)
            value_list.push(document.getElementById('step_check6').value)
            value_list.push(document.getElementById('comment').value)
            const signinperson = require('./signinperson.json');
            const perf = signinperson[signinperson.length - 1];
            value_list.push(perf);
            google.save_data("Mainte", value_list);
            if (document.getElementById('step_check6').value === "OK"){
                dialogs.alert("Data Uploaded!!! Thanks for performing maintenance.")
            }
            else if (document.getElementById('step_check6').value === "Error"){
                dialogs.alert("Data Uploaded!!! Thanks for performing maintenance. Please make sure you have reported about error.")
            }

            document.getElementById('refresh').click();
        }

        `
        )
        btn_field.appendChild(save);

        var refresh = document.createElement('button');
        refresh.setAttribute('id', 'refresh');
        refresh.innerHTML = 'Refresh';
        refresh.setAttribute('onclick',
        `
        document.getElementById('date').value = "";
        document.getElementById('eq_name').value = "";
        document.getElementById('type').value = "";
        for (let i=0; i<6; i++){
            var id = "step_check" + JSON.stringify(i);
            document.getElementById(id).value = "Undone";
        }
        document.getElementById('step_check6').value = "Select Status";
        document.getElementById('comment').value = "";

        `
        )
        btn_field.appendChild(refresh);

        datafield.appendChild(btn_field)

        datasection.innerHTML = datafield.innerHTML;
        
    }

    else if (document.getElementById('eq_name').value === "microscope" && this.value === "weekly"){
        var datasection  = document.getElementById('datasection');

        var no_status = "";
        var datafield = document.createElement('div');
        var status_option = ['Select Status','Yes', 'No'];
        
        var clean_steps =[
            "1. Appeared Images in AmScope Software are as Usual?...........................................",
            "2. Appeared Images in EyePieces are Usual? ..............................................................",
            "3. Light Source, Light Color, Aperture Adjustments are as Usual? ...........................",
            "4. Stage Movement Wheel's Tension are as Usual? ...................................................",
            "5. Check cables whether properly tied and arranged...................................................", 
            "6. Clean Sample Stage with Dry Tissue + IPA and Squeeze Blower........................."
        ]
        for (let i=0; i<clean_steps.length; i++){
            var step = document.createElement('div');
            step.setAttribute('id','step');
            var step_label = document.createElement('label');
            step_label.innerHTML = clean_steps[i]
            step.appendChild(step_label);

            var step_check = document.createElement('select');
            var step_id = "step_check" + JSON.stringify(i);
            
            step_check.setAttribute('id', step_id);
            for (let i = 0; i< status_option.length; i++){
                var option = document.createElement('option');
                option.setAttribute('value', status_option[i]);
                option.text = status_option[i];
                step_check.appendChild(option)
            }
            step_check.setAttribute('onchange', 
            `
            if (this.value === "No"){
                dialogs.alert("Please take screenshot/photo of error and inform to lab incharge with detail description.")
            }
            `)
            step.appendChild(step_check)
            datafield.appendChild(step);
        }

        var comm = document.createElement('input');
        comm.setAttribute('id', "comment");
        comm.setAttribute('placeholder', "Comment/Remark")
        datafield.appendChild(comm)

        var btn_field = document.createElement('div');
        btn_field.setAttribute('id', 'btn_field')

        var proce_hard = document.createElement('button');
        proce_hard.setAttribute('id', 'proce_hard');
        proce_hard.innerHTML = "Print Form";
        btn_field.appendChild(proce_hard)

        var save = document.createElement('button');
        save.setAttribute('id', 'save');
        save.innerHTML = 'Save';
        save.setAttribute('onclick', 
        `
        var value_list = [];
        var empty = 0;
        var no_count = 0;
        var id_array = ['date', 'eq_name', 'type']
        for (let i=0; i < id_array.length; i++){
            if (document.getElementById(id_array[i]).value === ""){
                empty = empty + 1;
            }
        }
        for (let i=0; i<6; i++){
            var id = "step_check" + JSON.stringify(i);
            if (document.getElementById(id).value === "Select Status" || document.getElementById(id).value === ""){
                empty = empty + 1;
            }
            if (document.getElementById(id).value === "No"){
                no_count = no_count + 1;
            }
        }
        if (empty > 0){
            dialogs.alert("Some Values Are Missing!!! Double Check Please.")
        }
        else{
            const weeklymainte = require('./weeklymainte.json');
            for (let i = 0; i < weeklymainte.length; i++){
                if (weeklymainte[i].Name === document.getElementById('eq_name').value){
                    weeklymainte[i].Date = document.getElementById('date').value;
                    if (no_count < 1){
                        weeklymainte[i].Status = "OK";
                    }
                    else{
                        weeklymainte[i].Status = "Error";
                    }
                    break;
                }
            }

            var saving_data = JSON.stringify(weeklymainte);
            const fs = require('fs');
            fs.writeFile('./resources/app/mainte/weeklymainte.json', saving_data, err => {
                if (err) throw err;
            });
            value_list.push(document.getElementById('date').value)
            value_list.push(document.getElementById('eq_name').value)
            value_list.push(document.getElementById('type').value)
            if (no_count < 1){
                value_list.push("OK")
            }
            else{
                value_list.push("Error")
            }
            value_list.push(document.getElementById('comment').value)
            const signinperson = require('./signinperson.json');
            const perf = signinperson[signinperson.length - 1];
            value_list.push(perf);
            google.save_data("Mainte", value_list);
            document.getElementById('refresh').click();
            if (no_count < 1){
                dialogs.alert("Data Uploaded!!! Thanks for performing maintenance.")
            }
            else{
                dialogs.alert("Data Uploaded!!! Thanks for performing maintenance. Please make sure you have reported about error.")
            }
        }

        `
        )
        btn_field.appendChild(save);

        var refresh = document.createElement('button');
        refresh.setAttribute('id', 'refresh');
        refresh.innerHTML = 'Refresh';
        refresh.setAttribute('onclick',
        `
        document.getElementById('date').value = "";
        document.getElementById('eq_name').value = "";
        document.getElementById('type').value = "";
        for (let i=0; i<6; i++){
            var id = "step_check" + JSON.stringify(i);
            document.getElementById(id).value = "Undone";
        }
        document.getElementById('comment').value = "";

        `
        )
        btn_field.appendChild(refresh);

        datafield.appendChild(btn_field)

        datasection.innerHTML = datafield.innerHTML;
    }
    
})