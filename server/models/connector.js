const mysqlConnection = require('./dbconnection');
var password = require('password-hash-and-salt');
var jwt = require('jsonwebtoken');

// ****************** Sample Output Objects ************************//

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

module.exports = {




// ****************** Function - Fetch All Roles ************************//

getAllRoles_db: function (res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;                                                                                 // not connected!
    var sql = 'SELECT id,roles FROM ?? WHERE ?? = ?';
    var query = connection.format(sql,["db_user_roles","status", "1"]);
    connection.query(query, function (error, results, fields) {                                       // Use the connection
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      if (results.length >= 1) {
        successResult["data"] = results;
        return res.send(successResult);
      }
      if (results.length == 0) {
        errorResult["Message"] = "No Records Found";
        return res.send(errorResult);
      }
      connection.release();                                                                           // Handle error after the release.
      if (error) throw error;                                                                         // Don't use the connection here, it has been returned to the pool.
    });
  });
},





// ****************** Function - Fetch All Users ************************//

getAllUsers_db: function (res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
    var sql = 'SELECT db_users.id,db_users.a_name,db_users.f_name,db_users.l_name,db_users.e_address,db_users.date_time,db_users.status,db_users.usr_role,db_user_roles.roles FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? != ? ORDER BY db_users.id DESC';
    var query = connection.format(sql,["db_users","db_user_roles","db_users.usr_role","db_user_roles.id","db_users.id",""]);
    connection.query(query, function (error, results, fields) {
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      if (results.length >= 1) {
        successResult["data"] = results;
        return res.send(successResult);
      }
      if (results.length == 0) {
        errorResult["Message"] = "No Records Found";
        return res.send(errorResult);
      }
      connection.release();
      if (error) throw error;
    });
  });
},






// ****************** Function - Check If User Exist or Not ************************//

asynCheckUsers_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
    var sql = 'SELECT COUNT(*) as numb FROM ?? WHERE ?? = ?';
    var query = connection.format(sql,["db_users","a_name", req.body.accountName]);     
    connection.query(query, function (error, results, fields) {
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      if (results[0].numb >= 1) {
        return res.send(errorResult);
      }
      if (results[0].numb == 0) {
        successResult["Message"] = "";
        return res.send(successResult);
      }
      connection.release();
      if (error) throw error;
    });
  });
},







// ****************** Function - Create a New User ************************//

addUser_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
    password(req.body.password).hash(function (error, hash) {
      var sql = 'INSERT INTO ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?';
      var query = connection.format(sql,["db_users","a_name", req.body.account_name, "f_name", req.body.first_name, "l_name", req.body.last_name,"e_address", req.body.email, "usr_pwd",hash, "usr_role",req.body.role]);
      connection.query(query, function (error, results, fields) {
        if (error) {
          errorResult["Message"] = "Something went wrong. Please try again later.";
          return res.send(errorResult);
        }
        else{
          successResult["Message"] = "User has been inserted successfully";
          return res.send(successResult);
        }
        connection.release();
        if (error) throw error;
      });
    });
  });
},






// ****************** Function - Update User Status ************************//

updateStatus_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
    var stat;
    if(req.body.param2 == 1) { stat = 0; } else { stat = 1 };
    var sql = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    var query = connection.format(sql,["db_users","status", stat, "id",req.body.param1]);
    connection.query(query, function (error, results, fields) {
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      else{
        successResult["Message"] = "User status updated successfully";
        return res.send(successResult);
      }
      connection.release();
      if (error) throw error;
    });
  });
},






// ****************** Function - Update User ************************//

editUser_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;

    if(req.body.passwordReader == true){                                                                        // Re-Enter Password Set To True
      password(req.body.password).hash(function (error, hash) {
        var sql = 'UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?';
        var query = connection.format(sql,["db_users","a_name", req.body.account_name, "f_name", req.body.first_name, "l_name", req.body.last_name,"e_address", req.body.email, "usr_pwd",hash, "usr_role",req.body.role, "id",req.body.userId]);
        connection.query(query, function (error, results, fields) {
          if (error) {
            errorResult["Message"] = "Something went wrong. Please try again later.";
            return res.send(errorResult);
          }
          else{
            successResult["Message"] = "User has been updated successfully";
            return res.send(successResult);
          }
          connection.release();
          if (error) throw error;
        });
      });

    }
    else{                                                                                                         // Re-Enter Password Set To False
      var sql = 'UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?';
      var query = connection.format(sql,["db_users","a_name", req.body.account_name, "f_name", req.body.first_name, "l_name", req.body.last_name,"e_address", req.body.email, "usr_role",req.body.role, "id",req.body.userId]);
      connection.query(query, function (error, results, fields) {
        if (error) {
          errorResult["Message"] = "Something went wrong. Please try again later.";
          return res.send(errorResult);
        }
        else{
          successResult["Message"] = "User has been updated successfully";
          return res.send(successResult);
        }
        connection.release();
        if (error) throw error;
      });
    }
  });
},


// ****************** Function - User Login ************************//

userLogin_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {   
   // password(req.body.password).hash(function (error, hash) {
      var sql = 'SELECT id,usr_pwd,status FROM ?? WHERE ?? = ?';
      var query = connection.format(sql,["db_users","a_name", req.body.username]);
      connection.query(query, function (error, results, fields) {
        if (error) {
          errorResult["Message"] = "Something went wrong. Please try again later.";
          return res.send(errorResult);
        }
        else{
          if (results.length <= 0){
            errorResult["Message"] = "Wrong username";
            return res.send(errorResult);
          }
          password(req.body.password).verifyAgainst(results[0].usr_pwd, function (error, verified) {
            if (verified == true) {
              if(results[0].status == 1){
                let payLoad = { subject: results[0].id };
                let token = jwt.sign(payLoad, 'secretKey');

                successResult["Message"] = "User login successful.";
                successResult["data"] = {token};
                return res.send(successResult);
              } else  {
                errorResult["Message"] = "User deactivated by adminstrator.";
                return res.send(errorResult);
              } 
            } else {
              errorResult["Message"] = "Wrong password";
              return res.send(errorResult);
            }
          }); 
        }
        connection.release();
        if (error) throw error;
      });
  });

},





// ****************** Function - Create a New Role ************************//

addRole_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
      var sql = 'INSERT INTO ?? SET ?? = ?';
      var query = connection.format(sql,["db_user_roles","roles", req.body.roles]);
      connection.query(query, function (error, results, fields) {
        if (error) {
          errorResult["Message"] = "Something went wrong. Please try again later.";
          return res.send(errorResult);
        }
        else{
          successResult["Message"] = "Role has been inserted successfully";
          return res.send(successResult);
        }
        connection.release();
        if (error) throw error;
      });
  });
},



// ****************** Function - Check If Role Exist or Not ************************//

asynCheckRole_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
    var sql = 'SELECT COUNT(*) as numb FROM ?? WHERE ?? = ?';
    var query = connection.format(sql,["db_user_roles","roles", req.body.roles]);     
    connection.query(query, function (error, results, fields) {
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      if (results[0].numb >= 1) {
        return res.send(errorResult);
      }
      if (results[0].numb == 0) {
        successResult["Message"] = "";
        return res.send(successResult);
      }
      connection.release();
      if (error) throw error;
    });
  });
},


// ****************** Function - Fetch All Roles for Role Page ************************//

getAllRolesPage_db: function (res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;                                                                                 // not connected!
    var sql = 'SELECT * FROM ?? WHERE ?? IS NOT NULL';
    var query = connection.format(sql,["db_user_roles","id"]);
    connection.query(query, function (error, results, fields) {                                       // Use the connection
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      if (results.length >= 1) {
        successResult["data"] = results;
        return res.send(successResult);
      }
      if (results.length == 0) {
        errorResult["Message"] = "No Records Found";
        return res.send(errorResult);
      }
      connection.release();                                                                           // Handle error after the release.
      if (error) throw error;                                                                         // Don't use the connection here, it has been returned to the pool.
    });
  });
},




// ****************** Function - Update Role Status ************************//

updateRoleStatus_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
    var stat;
    if(req.body.param2 == 1) { stat = 0; } else { stat = 1 };
    var sql = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    var query = connection.format(sql,["db_user_roles","status", stat, "id",req.body.param1]);
    connection.query(query, function (error, results, fields) {
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      else{
        successResult["Message"] = "Role status updated successfully";
        return res.send(successResult);
      }
      connection.release();
      if (error) throw error;
    });
  });
},



// ****************** Function - Update Role ************************//

editRole_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
      if (err) throw err;                                                                      
      var sql = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
      var query = connection.format(sql,["db_user_roles","roles", req.body.roles, "id",req.body.roleId]);
      connection.query(query, function (error, results, fields) {
        if (error) {
          errorResult["Message"] = "Something went wrong. Please try again later.";
          return res.send(errorResult);
        }
        else{
          successResult["Message"] = "Role has been updated successfully";
          return res.send(successResult);
        }
        connection.release();
        if (error) throw error;
      });
  });
},



// ****************** Function - Create a New Category ************************//

addCategory_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
      var sql = 'INSERT INTO ?? SET ?? = ?';
      var query = connection.format(sql,["db_inv_category","category", req.body.category]);
      connection.query(query, function (error, results, fields) {
        if (error) {
          errorResult["Message"] = "Something went wrong. Please try again later.";
          return res.send(errorResult);
        }
        else{
          successResult["Message"] = "Category has been inserted successfully";
          return res.send(successResult);
        }
        connection.release();
        if (error) throw error;
      });
  });
},



// ****************** Function - Check If Category Exist or Not ************************//

asynCheckCategory_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
    var sql = 'SELECT COUNT(*) as numb FROM ?? WHERE ?? = ?';
    var query = connection.format(sql,["db_inv_category","category", req.body.category]);     
    connection.query(query, function (error, results, fields) {
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      if (results[0].numb >= 1) {
        return res.send(errorResult);
      }
      if (results[0].numb == 0) {
        successResult["Message"] = "";
        return res.send(successResult);
      }
      connection.release();
      if (error) throw error;
    });
  });
},


// ****************** Function - Fetch All Category for Category Page ************************//

getAllCategoryPage_db: function (res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;                                                                                 // not connected!
    var sql = 'SELECT * FROM ?? WHERE ?? IS NOT NULL';
    var query = connection.format(sql,["db_inv_category","id"]);
    connection.query(query, function (error, results, fields) {                                       // Use the connection
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      if (results.length >= 1) {
        successResult["data"] = results;
        return res.send(successResult);
      }
      if (results.length == 0) {
        errorResult["Message"] = "No Records Found";
        return res.send(errorResult);
      }
      connection.release();                                                                           // Handle error after the release.
      if (error) throw error;                                                                         // Don't use the connection here, it has been returned to the pool.
    });
  });
},




// ****************** Function - Update Category Status ************************//

updateCategoryStatus_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
    var stat;
    if(req.body.param2 == 1) { stat = 0; } else { stat = 1 };
    var sql = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    var query = connection.format(sql,["db_inv_category","status", stat, "id",req.body.param1]);
    connection.query(query, function (error, results, fields) {
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      else{
        successResult["Message"] = "Category status updated successfully";
        return res.send(successResult);
      }
      connection.release();
      if (error) throw error;
    });
  });
},



// ****************** Function - Update Category ************************//

editCategory_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
      if (err) throw err;                                                                      
      var sql = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
      var query = connection.format(sql,["db_inv_category","category", req.body.category, "id",req.body.catId]);
      connection.query(query, function (error, results, fields) {
        if (error) {
          errorResult["Message"] = "Something went wrong. Please try again later.";
          return res.send(errorResult);
        }
        else{
          successResult["Message"] = "Category has been updated successfully";
          return res.send(successResult);
        }
        connection.release();
        if (error) throw error;
      });
  });
},



// ****************** Function - Fetch All Inventory for Inventory Page ************************//

getAllInventoryPage_db: function (res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;                                                                                 // not connected!
    var sql = 'SELECT db_inventory.id,db_inventory.part_no,db_inventory.part_name,db_inventory.part_desc,db_inventory.cost_price,db_inventory.quantity,db_inventory.part_image,db_inventory.date_time,db_inventory.status,db_inventory.cat_fk,db_inv_category.category FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? != ? ORDER BY db_inventory.id DESC';
    var query = connection.format(sql,["db_inventory","db_inv_category","db_inventory.cat_fk","db_inv_category.id","db_inventory.id",""]);
    connection.query(query, function (error, results, fields) {                                       // Use the connection
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      if (results.length >= 1) {
        successResult["data"] = results;
        return res.send(successResult);
      }
      if (results.length == 0) {
        errorResult["Message"] = "No Records Found";
        return res.send(errorResult);
      }
      connection.release();                                                                           // Handle error after the release.
      if (error) throw error;                                                                         // Don't use the connection here, it has been returned to the pool.
    });
  });
},



// ****************** Function - Fetch All Category ************************//

getAllCategory_db: function (res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;                                                                                 // not connected!
    var sql = 'SELECT id,category FROM ?? WHERE ?? = ?';
    var query = connection.format(sql,["db_inv_category","status", "1"]);
    connection.query(query, function (error, results, fields) {                                       // Use the connection
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      if (results.length >= 1) {
        successResult["data"] = results;
        return res.send(successResult);
      }
      if (results.length == 0) {
        errorResult["Message"] = "No Records Found";
        return res.send(errorResult);
      }
      connection.release();                                                                           // Handle error after the release.
      if (error) throw error;                                                                         // Don't use the connection here, it has been returned to the pool.
    });
  });
},




// ****************** Function - Check If Part Number Exist or Not ************************//

asynCheckPartno_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
    var sql = 'SELECT COUNT(*) as numb FROM ?? WHERE ?? = ?';
    var query = connection.format(sql,["db_inventory","part_no", req.body.partno]);     
    connection.query(query, function (error, results, fields) {
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      if (results[0].numb >= 1) {
        return res.send(errorResult);
      }
      if (results[0].numb == 0) {
        successResult["Message"] = "";
        return res.send(successResult);
      }
      connection.release();
      if (error) throw error;
    });
  });
},



// ****************** Function - Create a New Inventory ************************//

addInventory_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
      var sql = 'INSERT INTO ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?';
      var query = connection.format(sql,["db_inventory", "cat_fk", req.body.category, "part_no", req.body.part_no, "part_name", req.body.part_name, "part_desc", req.body.part_desc, "cost_price", req.body.price, "quantity", req.body.quantity, "part_image", req.filepath]);
      connection.query(query, function (error, results, fields) {
        if (error) {
          errorResult["Message"] = "Something went wrong. Please try again later.";
          return res.send(errorResult);
        }
        else{
          successResult["Message"] = "Inventory has been inserted successfully";
          return res.send(successResult);
        }
        connection.release();
        if (error) throw error;
      });
  });
},



// ****************** Function - Update Inventory Status ************************//

updateInventoryStatus_db: function (req,res) {
  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err;
    var stat;
    if(req.body.param2 == 1) { stat = 0; } else { stat = 1 };
    var sql = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    var query = connection.format(sql,["db_inventory","status", stat, "id",req.body.param1]);
    connection.query(query, function (error, results, fields) {
      if (error) {
        errorResult["Message"] = "Something went wrong. Please try again later.";
        return res.send(errorResult);
      }
      else{
        successResult["Message"] = "Inventory status updated successfully";
        return res.send(successResult);
      }
      connection.release();
      if (error) throw error;
    });
  });
},



};