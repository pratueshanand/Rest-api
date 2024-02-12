const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("./../../models/Product");

router.get("/", async (req, res, next) => {
  try {
    const data = await Product.find();
    console.log("data fetched");
    res.status(200).json({
      count: data.length,
      product: data
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "post request working",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: `http://localhost:3000/product/${result._id}`
          }
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then((docs) => {
      console.log(docs);
      console.log("from Databae", docs);
      if (docs) {
        res.status(200).json({
          product: docs,
          request: {
            type: 'GET',
            url: 'http://localhost/product'
          }
        });
      } else {
        res.status(404).json({ message: "Product id is not valid" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: {err} });
    });
});

router.patch("/:productId", async (req, res, next) => {
  try {
    const id = req.params.productId;
    const updatedData = req.body;
    const response = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!response) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
