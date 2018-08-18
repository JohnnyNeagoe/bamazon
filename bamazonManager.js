const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});
connection.connect(function(err,res){
    if (err) throw err
    console.log("connected as id " + connection.threadId + "\n");
    managerMenu();
})
function managerMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
            ]
        })
    .then(function(answer) {
    switch (answer.action) {
        case "View Products for Sale":
            productSearch();
            break;
        case "View Low Inventory":
            lowInventoryCount();
            break;
        case "Add to Inventory":
            addToInventory();
            break;
        case "Add New Product":
            addNewProduct();
            break;
        }
    });
}

function productSearch(){
    console.log("Displaying all Products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i<res.length; i++){
            console.log(res[i].item_id + " | " + "Name: " + res[i].products_name + " | " + "Department: " +  res[i].department_name + " | " + "Price: " + "$" + res[i].price + " | " + "Stock Available: " +  res[i].stock_quantity + " | ");
        }
        managerMenu();
    });
};

function lowInventoryCount(){
    connection.query("SELECT * FROM products WHERE stock_quantity", function(err, res) {
        if (res.stock_quantity < 5){
            console.log(res.stock_quantity)
            for (var i = 0; i<res.length; i++){
                console.log(res[i].item_id + " | " + "Name: " + res[i].products_name + " | " + "Department: " +  res[i].department_name + " | " + "Price: " + "$" + res[i].price + " | " + "Stock Available: " +  res[i].stock_quantity + " | ");
            }

        } else console.log("Full capacity")


        });
    }