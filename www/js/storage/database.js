/**
 * Created by USUARIO on 07/05/2014.
 */

//Database handling
var database_js = function(){

    this.dbSupport = false;
    this.supportError = "";
    var myDB = null;

    this.initialize = function() {

        try {
            if (window.openDatabase) {

                var shortName = 'NovaventaDB';
                var version = '1.0';
                var displayName = 'Novaventa Database';
                var maxSize = 100000; //  bytes
                felicisDB = openDatabase(shortName, version, displayName, maxSize);

                console.log("database opened");

                createTables();

                this.dbSupport = true;
            } else {

                this.supportError = "Databases are not supported in this browser";
            }
        } catch (e) {

            if (e == 2) {
                // Version number mismatch.
                this.supportError = "Invalid database version.";
            } else {
                this.supportError = "Unknown error " + e + ".";
            }

            return;
        }
    }

    this.executeCommand = function(command, nullHandler, errorHandler){
        myDB.transaction(
            function (transaction) {
                var data = [name];
                transaction.executeSql(command, [], nullHandler, errorHandler);
            }
        );
    }

    this.executeSelect = function(command, dataHandler, errorHandler){
        myDB.transaction(
            function (transaction) {
                var data = [name];
                transaction.executeSql(command, [], dataHandler, errorHandler);
            }
        );
    }

    var createTables = function(){

        myDB.transaction(
            function (transaction) {
                /*
                    transaction.executeSql('drop TABLE IF EXISTS user;');
                */

                transaction.executeSql('CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY);', [], nullDataHandler, errorHandler);

                console.log("tables created");

            });
    }

    function nullDataHandler(transaction, results) {

        console.log("null handler");
    }

    function dataSelectHandler(transaction, results){

        console.log("rows: " + results.rows.length);
    }

    function errorHandler(transaction, error){

        console.log("db error " + error);
    }

}
