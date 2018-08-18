const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});
let itemChosen;
let quantityAvailable;
let quantityChosen;
let qLeft;

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayData();
});

function displayData() {
    console.log("Displaying all Products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i<res.length; i++){
            console.log(res[i].item_id + " | " + "Name: " + res[i].products_name + " | " + "Department: " +  res[i].department_name + " | " + "Price: " + "$" + res[i].price + " | " + "Stock Available: " +  res[i].stock_quantity + " | ");
        }
        productSearch();
    });
};
function productSearch() {
inquirer
    .prompt([
    {
    name: "item_id",
    type: "input",
    message: "What is the id of the product you would like to purchase?"
    },
    { 
    name: "stock_quantity",
    type: "input",
    message: "How many units of the product would you like to purchase?"
    }
    ]).then(function(answer) {
        itemChosen = answer.item_id;
        quantityChosen = answer.stock_quantity;
        if (itemChosen > 0 && quantityChosen > 0){
            connection.query("SELECT * FROM products WHERE ?", { item_id: itemChosen }, function(err, res) {
                
                quantityAvailable =  res[0].stock_quantity;
                qLeft = [quantityAvailable - quantityChosen];
                var orderCost = quantityChosen*(res[0].price);

                if (quantityChosen <= quantityAvailable){
                    placeOrder();
                    console.log(
                        "Product Purchased: " +
                        res[0].products_name +
                        " || Total Cost of Order: " +
                        orderCost
                    );
                } else console.log("Insufficient quantity!");
                productSearch();
            });
        } else {
            console.log("Please enter a valid item id or quantity");
            productSearch();
        }
    });
};
function placeOrder(){
    connection.query(
        "UPDATE products SET ? WHERE ?",[{ stock_quantity: qLeft } , { item_id: itemChosen }]
    );
};



