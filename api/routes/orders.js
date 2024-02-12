const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Order = require('./../../models/Order')
const Product = require('./../../models/Product')

router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product','name price')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/id'+doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).json({
                    message: "Product not found"
                })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order Stored',
                createOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/id'+result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            })
        })
        
})

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        Message: 'Order Id is this',
        orderId: id
    });
})

router.delete('/:id', (req, res, next) => {
    Order.findByIdAndDelete(req.params.id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Deleted'
            })
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

module.exports = router;