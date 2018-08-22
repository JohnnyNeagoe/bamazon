const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});
let oldQuantity;
let idSelected;
let productName;
let newQuantity;

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
    let query = "SELECT * FROM products"
    connection.query(query, function(err, res) {
        console.log("\n")
        for (var i = 0; i<res.length; i++){
            console.log(res[i].item_id + " | " + "Name: " + res[i].products_name + " | " + "Department: " +  res[i].department_name + " | " + "Price: " + "$" + res[i].price + " | " + "Stock Available: " +  res[i].stock_quantity + " | ");
        }
        console.log("\n")
        managerMenu();
    });
};

function lowInventoryCount(){
    let query = "SELECT * FROM products WHERE stock_quantity < 5"
    connection.query(query, function(err, res) {
        if (res.length < 1) {  
            console.log("There are no products with an inventory of less then 5 items!")
        }
        else { 
            console.log("\n")
            for (var i = 0; i<res.length; i++){
                console.log(res[i].item_id + " | " + "Name: " + res[i].products_name + " | " + "Department: " +  res[i].department_name + " | " + "Price: " + "$" + res[i].price + " | " + "Stock Available: " +  res[i].stock_quantity + " | ");
            } 
        } 
        console.log("\n")
               managerMenu()
    }); 
};

function addToInventory(){
    inquirer
    .prompt([
    {
        name: "product",
        type: "input",
        message: "What is the ID of the product undergoing an inventory change?"
    },
    {
        name: "add",
        type: "input",
        message: "How many units will be added?"

    }]).then(function(manager){
        newQuantity = parseFloat(manager.add);
        idSelected = manager.product;
            connection.query("SELECT * FROM products WHERE ?", {item_id: idSelected}, function(err, res){
                oldQuantity = res[0].stock_quantity;
                productName = res[0].products_name;
                updateProduct();
            });
    });
    function updateProduct(){
        let query = "UPDATE products SET ? WHERE ?";
        connection.query(query,[ {stock_quantity: oldQuantity + newQuantity,},{item_id: idSelected,} ], function(err, res){
            console.log("\n");
            console.log(res.affectedRows + " One Product has Been Updated!")
            console.log(newQuantity + " units of " + productName + " have been added");
            console.log("\n");
            managerMenu();
        })
    }
}

function addNewProduct(){
    inquirer
    .prompt([
        {
            type: "input",
            name: "name",
            message: "Please enter new product name"
        },
        {
            type: "input",
            name: "department",
            message: "Please enter department for new products"
        },
        {
            type: "input",
            name: "price",
            message: "Please enter the new product's cost per unit (number only, no characters)"
        },
        {
            type: "input",
            name: "quantity",
            message: "Please enter current inventory of new product"
        }
    ]).then(function(newProduct){
        let newName = newProduct.name;
        let newDepartment = newProduct.department;
        let newPrice = newProduct.price;
        let newQuantity = newProduct.quantity;
        let query = "INSERT INTO products SET ?";
        connection.query(query, 
        {
            products_name: newName ,
            department_name: newDepartment ,
            price: newPrice,
            stock_quantity: newQuantity
        },
        function(err, res){
            console.log("\n");
            console.log(res.affectedRows + " Product added to bamazon!");
            console.log("\n");
            managerMenu();
        })
    });
}