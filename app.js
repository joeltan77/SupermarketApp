const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RP738964$',
    database: 'c237_supermarketapp'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Display all products
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM products';

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error retrieving products');
        }

        res.render('index', {
            products: results
        });
    });
});

app.get('/product/:id', (req, res) => {
    const productId = req.params.id;

    const sql = 'SELECT * FROM products WHERE productId = ?';

    db.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error Retrieving product by ID');
        }

        if (results.length > 0) {
            res.render('product', {
                product: results[0]
            });
        } else {
            res.send('Product not found');
        }
    });
});

app.get('/addProduct', (req, res) => {
    res.render('addProduct');
});
app.post('/addProduct', (req, res) => {
    // Extract product data from the request body
    const { name, quantity, price, image } = req.body;
    const sql = 'INSERT INTO products (productName, quantity, price, image) VALUES (?, ?, ?, ?)';
    // Insert the new product into the database
    db.query(sql, [name, quantity, price, image], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error adding product:", error);
            res.send('Error adding product');
        } else {
            // Send a success response
            res.redirect('/');
        }
    });
});

app.get('/editProduct/:id', (req, res) => {
    const productId = req.params.id;

    const sql = 'SELECT * FROM products WHERE productId = ?';

    db.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error retrieving product');
        }

        if (results.length > 0) {
            res.render('editProduct', {
                product: results[0]
            });
        } else {
            res.send('Product not found');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});