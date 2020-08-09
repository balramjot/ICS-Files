const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());
const jsonParser = bodyParser.json();
const tokenValidator = require('./models/token-validator');

const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use('/images', express.static(__dirname + '/uploads/'));
newUploadedFileName: string = null;


var errorResult = {
    "Code": "0",
    "Message": "Operation not successful.",
    "data": ""
};
var successResult = {
    "Code": "1",
    "Message": "Operation successful.",
    "data": ""
};


// ****************** Method - For Fetching Roles ************************//

app.get('/getAllRoles_db/', jsonParser, function (req,res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.getAllRoles_db(res);
});




// ****************** Method - For Fetching Users ************************//

app.get('/getAllUsers_db/',tokenValidator.verifyToken, jsonParser, function (req,res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.getAllUsers_db(res);
});





// ****************** Method - To Check If User Exist or Not ************************//

app.post('/asynCheckUsers_db/', jsonParser, function (req,res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.asynCheckUsers_db(req,res);
});




// ****************** Method - Creating a New User ************************//

app.post('/addUser_db/', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.addUser_db(req,res);    
});




// ****************** Method - Update User Status ************************//

app.post('/updateStatus_db/', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.updateStatus_db(req,res);    
});




// ****************** Method - Edit User Information ************************//

app.post('/editUser_db/', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.editUser_db(req,res);
});


// ****************** Method - User Login Information ************************//

app.post('/userLogin_db/', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.userLogin_db(req,res);
});


// ****************** Method - Creating a New Role ************************//

app.post('/addRole_db/', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.addRole_db(req,res);    
});


// ****************** Method - To Check If Role Exist or Not ************************//

app.post('/asynCheckRole_db/', jsonParser, function (req,res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.asynCheckRole_db(req,res);
});


// ****************** Method - For Fetching Roles for Role Page ************************//

app.get('/getAllRolesPage_db/', jsonParser, function (req,res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.getAllRolesPage_db(res);
});



// ****************** Method - Update User Status ************************//

app.post('/updateRoleStatus_db/', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.updateRoleStatus_db(req,res);    
});


// ****************** Method - Edit Role Information ************************//

app.post('/editRole_db/', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.editRole_db(req,res);
});


// ****************** Method - Creating a New Category ************************//

app.post('/addCategory_db', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.addCategory_db(req,res);    
});


// ****************** Method - To Check If Category Exist or Not ************************//

app.post('/asynCheckCategory_db/', jsonParser, function (req,res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.asynCheckCategory_db(req,res);
});


// ****************** Method - For Fetching Category for Category Page ************************//

app.get('/getAllCategoryPage_db/', jsonParser, function (req,res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.getAllCategoryPage_db(res);
});



// ****************** Method - Update Category Status ************************//

app.post('/updateCategoryStatus_db/', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.updateCategoryStatus_db(req,res);    
});


// ****************** Method - Edit Category Information ************************//

app.post('/editCategory_db/', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.editCategory_db(req,res);
});




// ****************** Method - For Fetching Inventory for Inventory Page ************************//

app.get('/getAllInventoryPage_db/', jsonParser, function (req,res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.getAllInventoryPage_db(res);
});




// ****************** Method - For Fetching Category ************************//

app.get('/getAllCategory_db/', jsonParser, function (req,res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.getAllCategory_db(res);
});




// ****************** Method - Image Upload ************************//

app.post('/uploadImage_db/', function (req, res) {
    var dbFunctions = require('./models/connector');
    
    if (!req.files || Object.keys(req.files).length === 0) {
        errorResult["Message"] = "No files were uploaded.";
        return res.send(errorResult);
        //return res.status(400).send('No files were uploaded.');
        }
        
    let sampleFile = req.files.file;

    let spt = sampleFile.name.split('.');
    let lstelm = spt[spt.length - 1];
    let rndNum = Math.floor(Math.random() * 99999);
    let newName = sampleFile.md5 + rndNum + '.' + lstelm;
    

    sampleFile.mv('./uploads/' + newName, function(err) {
    if (err) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
        //return res.status(500).send(err);
    } else {
        this.newUploadedFileName = newName;
        successResult["Message"] = "Upload Successful";
        return res.send(successResult);
    }
    });

      
});



// ****************** Method - To Check If Part Number Exist or Not ************************//

app.post('/asynCheckPartno_db/', jsonParser, function (req,res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.asynCheckPartno_db(req,res);
});



// ****************** Method - Add Inventory ************************//

app.post('/addInventory_db/', jsonParser, function (req, res) {
    var obj = new Object({ 'filepath': this.newUploadedFileName });
    var obj1 = Object.assign(req, obj);
    var dbFunctions = require('./models/connector');
    dbFunctions.addInventory_db(obj1,res);
});



// ****************** Method - Update Inventory Status ************************//

app.post('/updateInventoryStatus_db/', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.updateInventoryStatus_db(req,res);    
});





// ****************** Message To Be Displayed In Console Window on Successful Connection Setup ************************//


app.use('/', (req, res) => res.send("Welcome to Sota Tool Inventory !"));
app.listen(process.env.PORT, () => console.log('Server is ready on localhost:' + process.env.PORT));