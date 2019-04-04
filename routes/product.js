const express = require('express');
const jsonParser = require('body-parser');
const passport = require('passport');
const Product = require('../models/product');

const router = express.Router();

// Auth
const jwtAuth = passport.authenticate('jwt', { session: false });

// Get all Products
router.get('/', jwtAuth, (req, res) => {
  return Product.find()
    .then(products => {
      res.status(200).json(products);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Get Product by ID
router.get('/:id', jwtAuth, (req, res) => {
    const {id} = req.params;
    return Product.findOne({_id: id})
        .then(product => {
            res.status(200).json(product);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// Update Product by ID
router.put('/:id', jsonParser, jwtAuth, (req, res) => {
    const {id} = req.params;
    const toUpdate = {};
    const updateableFields = ['name', 'type', 'price', 'description'];

    updateableFields.forEach(field => {
        if (field in req.body) {
        toUpdate[field] = req.body[field];
        }
    });

    return Product.findOneAndUpdate({_id: id}, toUpdate, {new: true})
        .then(results => {
            res.status(200).json(results);
        })
        .catch(err => {
            res.status(500).json(err);
        }); 
});

// Create new Product
router.post('/', jsonParser, jwtAuth, (req, res) => {
    const {name, type, price, description} = req.body;
    
    return Product.find({name, type})
        .count()
        .then(count => {
            if(count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Product already exists',
                    location: 'Product'
                });
            }
            return Product.create({
                name,
                type,
                price,
                description
            })
        })
        .then(product => {
            res.status(201).json(product);
        })
        .catch(err => {
            if(err.reason === 'ValidationError') {
                res.status(err.code).json(err);
            }
            res.status(500).json(err)
        });    
});

// Delete Product by ID
router.delete('/:id', jwtAuth, (req, res) => {
  const {id} = req.params;
  return Product.findOneAndDelete({id_: id})
    .then(() => {
        res.status(202).json('deleted');
    })
    .catch(err => {
        res.status(500).json(err)
    });
});

module.exports = router;
