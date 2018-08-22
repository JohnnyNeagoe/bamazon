DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT ,
products_name varchar(100) NULL,
department_name varchar(100) NULL,
price DECIMAL(10, 2) NULL,
stock_quantity INT NOT NULL,
Primary key (item_id)
);

insert into products (products_name, department_name, price, stock_quantity) values( "IPhone" ,"Technology", 800, 10), ( "Keurig K-Elite" ,"Lifestyle", 170, 4),( "Assasin's Creed Origns (Xbox)" ,"Games", 80, 25),( "Beats by Dre" ,"Technology", 300, 9),( "Rolex" ,"Accessories", 4000, 3),( "Gold Chain" ,"Accessories", 800, 17),( "Jordan 1s" ,"Shoes", 180, 2),( "Canada Goose Bomber" ,"Clothing", 1000, 12),( "Levi Jeans (404)" ,"Clothing", 80, 23),( "Black T-Shirt" ,"Clothing", 20, 30);

SELECT * FROM products;