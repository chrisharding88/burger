var connection = require("../config/connection.js");

function printQuestionMarks(num) {
    var array = [];
  
    for (var i = 0; i < num; i++) {
      array.push("?");
    }
  
    return array.toString();
  }

function objectToMySQL (obj) {
    var array = [];

    for (var key in obj){
        if (Object.hasOwnProperty.call(obj, key)) {
          var value = obj[key]
            // if string with spaces, add quotations (Bacon Cheeseburger => 'Bacon Cheeseburger')
            if (typeof value === "string" && value.indexOf(" ") >= 0) {
              value = "'" + value + "'";
            }
            // e.g. {name: 'Bacon Cheeseburger'} => ["name='Bacon Cheeseburger'"]
            // e.g. {devoured: true} => ["devoured=true"]
            array.push(`${key} = ${value}`);
        }
    }

    return array.toString();
}

var orm ={
    all: function(tableInput, cb){
        var selectQuery = `SELECT * FROM ${tableInput} ;`
        connection.query(selectQuery, function(err,res){
            if (err) throw err;
            cb(res);
        })
    },
    create: function(table,cols,vals,cb){
        var insertQuery = `INSERT INTO ${table}`
        insertQuery += " (";
        insertQuery += cols.toString();
        insertQuery += ") ";
        insertQuery += "VALUES (";
        insertQuery += printQuestionMarks(vals.length);
        insertQuery += ") ";
     
    console.log(insertQuery);
    connection.query(insertQuery, vals, function(err,res){
        if (err) throw err;
        cb(res);
    });

    },
    update: function(table, objColVals, condition, cb) {
        var updateString = `UPDATE ${table}`;
    
        updateString += " SET ";
        updateString += objectToMySQL(objColVals);
        updateString += " WHERE ";
        updateString += condition;
    
        console.log(updateString);
        connection.query(updateString, function(err, result) {
          if (err) throw err;
    
          cb(result);
        });
      },
      delete: function(table, condition, cb) {
        var deleteString = `DELETE FROM ${table}`;
        deleteString += " WHERE ";
        deleteString += condition;
        console.log(deleteString)
    
        connection.query(deleteString, function(err, result) {
          if (err) throw err;
        
    
          cb(result);
        });
      }
    

};

module.exports = orm;