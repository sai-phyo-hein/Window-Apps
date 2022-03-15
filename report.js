const { doubleclickbidmanager } = require("googleapis/build/src/apis/doubleclickbidmanager");
const {jsPDF} = require("jspdf");

function lastPerson(personlist){
    var namelist = personlist;
    return namelist[namelist.length - 1];
};
module.exports = {
    create_pretreat_report: function(person, folder_path, remark){
        
        cpl_pretreat_limit = [30, 50]
        
        var doc = new jsPDF({
            unit: "mm", 
            orientation: 'portrait', 
            format:[210, 297]
        });
        var img = new Image();
        img.src = "./resources/app/imgs/logo_full.jpg"
        doc.addImage(img,'jpg', 25.4, 25.4, 70, 22 );
        
        doc.setFont('Calibri', 'bold');
        doc.setFontSize(20);
        doc.text("Pretrement Test Report", 67, 58);

        doc.setFont('Calibri', 'bold');
        doc.setFontSize(14);
        var label_list = ['Sample Name :', "Sampling Date :", "Tester :", "Test Date:"]
        var y1 = 70;
        var y2 = 72;
        const step = 15;
        for (let i=0;i<label_list.length;i++){
            doc.text(label_list[i], 40, y1);
            if (i===1 || i===3){
                doc.text(".....................................................(y-m-d)", 75, y2);
            }
            else{
                doc.text("............................................................", 75, y2);
            }
            y1 = y1 + step;
            y2 = y2 + step;
        }

        
        doc.text("Test Type :", 35, 130)
        doc.text("..................................................", 60, 132);
        

        doc.text("BMT :", 130, 130)
        doc.text("....................", 145, 132);
        
        doc.setFont('Calibri', 'bold');
        doc.setFontSize(13);
            
        position_list = ["Blank T Side:", "Blank B Side:",
                            "Operator T Side:", "Operator B Side:",
                            "Middle T Side:", "Middle B Side:", 
                            "Driver T Side:", "Driver B Side:"];
        var y = 160;
        const step2 = 12;
        for (let i=0; i< position_list.length; i++){
            doc.text(position_list[i], 30, y)
            doc.text("Avg:", 137, y)
            y = y + step2;
        };

        doc.text("Standard:", 115, 148);
        

        doc.setFont('Courier', 'bold');
        doc.setFontSize(14);

        doc.text(document.getElementById('type').value, 90, 70);
        doc.text(document.getElementById('samplingdate').value, 90, 85);
        var perf = "";
        if (person === 0){
            var sign_person = require('./signinperson.json');
            perf = lastPerson(sign_person);
        }
        else if (person === 1){
            perf = document.getElementById("byother").value;
        }
        doc.text(perf, 90, 100);
        doc.text(document.getElementById('date').value, 90, 115);


        doc.text(document.getElementById('testpointtype').value, 62, 130);

        doc.text(document.getElementById('bmt').value, 147, 130);

        doc.text(document.getElementById('basetype').value, 137, 148);

        var data_array = ['blankT1', 'blankT2', 'blankT3', 'blankB1', 'blankB2', 'blankB3', 'operatorT1', 'operatorT2', 'operatorT3', 'operatorB1', 'operatorB2', 'operatorB3', 'middleT1', 'middleT2', 'middleT3', 'middleB1', 'middleB2', 'middleB3', 'driverT1', 'driverT2', 'driverT3', 'driverB1', 'driverB2', 'driverB3'];

        var data_x = 66;
        var data_y = 160;
        const data_x_step = 25;
        const data_y_step = 12;

        var index = 0;
        for (let i=0; i < 8; i++){
            for (let j=0; j< 3; j++){
                var value = document.getElementById(data_array[index]).value/1.0;
                if ((value < cpl_pretreat_limit[0] || value > cpl_pretreat_limit[1] && value !== "---")){
                    doc.setTextColor(255, 0, 0);
                }
                else{
                    doc.setTextColor(0,0,0);
                }
                value = value.toFixed(3).toString();
                if (value === "0.000"){
                    value = "---"
                }
                doc.text(value, data_x, data_y);
                data_x = data_x + data_x_step;
                index = index + 1;
                doc.setTextColor(0,0,0);
            }
            data_x = 66;
            data_y = data_y + data_y_step;
            
        }

        avg_y = 160;
        var avg_array = ['blankT_avg', 'blankB_avg','operatorT_avg', 'operatorB_avg', 'middleT_avg', 'middleB_avg', 'driverT_avg', 'driverB_avg'];
        for (let i=0; i<8; i++){
            doc.text(document.getElementById(avg_array[i]).getAttribute('placeholder'), 150, avg_y);
            avg_y = avg_y + data_y_step;

        }

        if(remark !== "" && typeof remark !== "undefined"){
            remark_txt = "Remark: "+ remark;
            doc.text(remark_txt, 30, 260)
        }

        var filename = folder_path + document.getElementById('type').value + " ("+ document.getElementById('date').value + "_"+ document.getElementById('start').value.toString().replace(":", "-")+").pdf";

        doc.save(filename);
        
    },

    create_txt_file: function(txt_string, filename){
        var blob = new Blob([txt_string], {type: "text/plain;charset=utf-8"});
        Filesaver.saveAs(blob, filename)
    }
    
}

