const express = require('express');
const app = express();
const mysql = require('mysql');
let pool= mysql.createPool({
    connectionLimit :10,
    host :"localhost",
    user:"root",
    database :"market"

});
app.use(express.json());//to access body in post
app.listen(5000, () => {
    console.log("server is on port 5000");
});
app.get('/market/products',(req,res)=>{
        pool.query(
            "select * from thecamp_market",
    function (err,result,fields){
if (err) res.status(404).send(err)
res.send(result);
    });
});
app.post('/market/products', (req, res) => {
    
    pool.query(
        `insert into  thecamp_market (id,product_name,product_value,product_quantity,recored_date ) 
        VALUES ("${req.body.id}","${req.body.product_name}","${req.body.product_value}",
        "${req.body.product_quantity }","${req.body.recored_date }")`,
        function(err,results,fields){
            if (err) res.status(404).send(err)
            res.send(results);
        }
    )
});
app.delete('/market/products', (req, res) => {
    const id = req.body.id;
    pool.query(
        `DELETE FROM thecamp_market WHERE id = ${id}`,
        function(err, results, fields) {
            if (err) return res.status(404).send(err);
            console.log('Deleted ');
            res.send('Deleted ');
        }
    );
});
app.patch('/market/products', (req, res) => {
    const product = req.body;
    pool.query(
        `UPDATE thecamp_market SET 
         product_name = '${product.product_name}',
         product_value = ${product.product_value},
         product_quantity = ${product.product_quantity}
         WHERE id = ${product.id}`,
        function(err, results, fields) {
            if (err) return res.status(404).send(err);
            console.log(`Updated `);
            res.send(`Updated `);
        }
    );
});
app.post('/market/sells', (req, res) => {
    const sell = req.body;
    pool.query(
        `INSERT INTO thecamp_market_sells (product_id, sales_quantity, sell_date) 
         VALUES (${sell.product_id}, ${sell.sales_quantity}, NOW())`,
        function(err, results, fields) {
            if (err) return res.status(404).send(err);
            console.log(`Recorded new sell with id ${results.insertId}`);
            res.send(`Recorded new sell with id ${results.insertId}`);
        }
    );
});