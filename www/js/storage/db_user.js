/**
 * Created by USUARIO on 28/11/2014.
 */

//Table handling
var db_user_js = function(db){

    var myDb = db;

    this.insert = function(id){
        myDb.executeCommand("INSERT INTO user (id) VALUES ('" + id + "');", nullDataHandler, errorHandler);
        console.log("user inserted");
    }

    this.delete = function(){
        myDb.executeCommand("DELETE FROM user;", nullDataHandler, errorHandler);

        console.log("users deleted");
    }

    this.getAll = function(dataHandler){
        myDb.executeSelect("SELECT id FROM user;", dataHandler, errorHandler);
    }

    function nullDataHandler(transaction, results) {

        console.log("null handler users");
    }

    function errorHandler(transaction, error){

        console.log("users db error " + error.message);
    }
}