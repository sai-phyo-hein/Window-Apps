const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const ipc = electron.ipcMain;

let mainWindow;

app.on('ready', _ => {
    //Sign In Window Configuration
    signInwin = new BrowserWindow({
        width: 400,
        resizable:false,
        title: "Data Tool Sign In",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true,
            enableBlinkFeatures:true,
            enableWebSQL:true,
            contextIsolation: false,
            
        }
    });
    signInwin.loadURL(url.format({
        pathname: path.join(__dirname, 'signin.html'),
        protocol : 'file', 
        slashes : true
    }));
    signInwin.removeMenu();
    //signInwin.webContents.openDevTools();
    signInwin.on('closed', () => {
        if (app.quitting){
            signInwin = null;
        }
    });
});

//when window all closed
app.on('window-all-closed', _ => {
    if (process.platform !== 'darwin'){
        app.quit()
    }
});

// when the app is started
app.on('activate', _ => {
    if (signInwin === null){
        createWindow()
    }
});

//when the account is signed in and accessed
ipc.on('show-dashboard', _ => {
    signInwin.close();
    //Summary DashboardWindow Configuration
    dashboardwin = new BrowserWindow({
        show: true,
        width: 1200,
        height: 700,
        
        title: "Requirement Summary Dashboard",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true,
            enableBlinkFeatures:true,
            enableWebSQL:true,
            contextIsolation: false,
        }
    });
    dashboardwin.loadURL(url.format({
        pathname: path.join(__dirname, 'dashboard.html'),
        protocol : 'file', 
        slashes : true
    }));
    dashboardwin.removeMenu();
    //dashboardwin.webContents.openDevTools();
    dashboardwin.on('closed', () => {
        if (app.quitting){
            dashboardwin = null;
        }
    });
});

//when the test record button from navigation bar is clicked
ipc.on('show-testledgerentry', _=>{
    //Testing Record Window Configuration
    dashboardwin.hide()
    testrecordwin = new BrowserWindow({
        resizable : false,
        closable: true, 
        width: 1200,
        height: 700,
        modal:false,
        title: "Test Data / Equipment Usage Ledger",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true,
            enableBlinkFeatures:true,
            enableWebSQL:true,
            contextIsolation: false,
        }
    });
    testrecordwin.loadURL(url.format({
        pathname: path.join(__dirname, 'testledger.html'),
        protocol : 'file', 
        slashes : true
    }));
    testrecordwin.removeMenu();
    //testrecordwin.webContents.openDevTools();    
    testrecordwin.on('closed', () => {
        testrecordwin = null;
        dashboardwin.show();
    })
    
});

//when consumable button from navigation bar is clicked
ipc.on('show-consumableledger', _=>{
    dashboardwin.hide()
    //Comsumable Amount Recording Windown 
    consumablerecordwin = new BrowserWindow({
        resizable: false,
        closable: true,
        width: 1200,
        height: 700,
        modal:false,
        title: "Consumable Refill | Entry | Withdraw Ledger",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true,
            enableBlinkFeatures:true,
            enableWebSQL:true,
            contextIsolation: false,
        }
    });
    consumablerecordwin.loadURL(url.format({
        pathname: path.join(__dirname, 'consumablerecord.html'),
        protocol : 'file', 
        slashes : true
    }));
    consumablerecordwin.removeMenu();
    //consumablerecordwin.webContents.openDevTools();
    consumablerecordwin.on('closed', () => {
        dashboardwin.show()
    });
})


//when maintenance button from navigation bar is clicked
ipc.on('show-mainte', _=>{
    dashboardwin.hide()
    //Equipment maintenance report recording window configuration
    equipmentmaintewin = new BrowserWindow({
        closable: true,
        resizable: false,
        width: 1000,
        height: 700,
        modal:false,
        title: "Data Tool Sign In",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true,
            enableBlinkFeatures:true,
            enableWebSQL:true,
            contextIsolation: false,
        }
    });
    equipmentmaintewin.loadURL(url.format({
        pathname: path.join(__dirname, 'maintenance.html'),
        protocol : 'file', 
        slashes : true
    }));
    equipmentmaintewin.removeMenu();
    //equipmentmaintewin.webContents.openDevTools();
    equipmentmaintewin.on('closed', () => {
        dashboardwin.show()
    });
})


