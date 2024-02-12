const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const Product = require('./api/routes/products');
const Order = require('./api/routes/orders');

const db = require('./db');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Origin",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Alow-Methods', 'PUT, POST, DELETE, PATCH, GET')
        res.status(200).json({});
    }
    next();
})

app.get('/', (req, res) => {
    res.status(201).json({message: 'Get Request Working'});
})

app.use('/product', Product);
app.use('/order', Order);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
})

module.exports = app; 