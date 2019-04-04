const express = require('express');
const jsonParser = require('body-parser');
const passport = require('passport');
const Customer = require('../models/customer');

const router = express.Router();

// Auth
const jwtAuth = passport.authenticate('jwt', { session: false });

// Get all Customers
router.get('/', jwtAuth, (req, res) => {
  return Customer.find()
    .then(customers => {
      res.status(200).json(customers);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Get Customer by ID
router.get('/:id', jwtAuth, (req, res) => {
    const {id} = req.params;
    return Customer.findOne({_id: id})
        .then(customer => {
            res.status(200).json(customer);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// Update Customer by ID
router.put('/:id', jsonParser, jwtAuth, (req, res) => {
    const {id} = req.params;
    const toUpdate = {};
    const updateableFields = ['firstName', 'lastName', 'authorizedUsers', 'companyName', 'phoneNumbers', 'emailAddress', 'notes', 'instructions'];

    updateableFields.forEach(field => {
        if (field in req.body) {
        toUpdate[field] = req.body[field];
        }
    });

    return Customer.findOneAndUpdate({_id: id}, toUpdate, {new: true})
        .then(results => {
            res.status(200).json(results);
        })
        .catch(err => {
            res.status(500).json(err);
        }); 
});

// Create new Customer
router.post('/', jsonParser, jwtAuth, (req, res) => {
    const {firstName, lastName, authorizedUsers = [], companyName = '', phoneNumbers, emailAddress, notes = [], instructions = ''} = req.body;
    
    return Customer.find({ $or: [{firstName, lastName}, {emailAddress}] })
        .count()
        .then(count => {
            if(count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Customer already exists',
                    location: 'Customer'
                });
            }
            return Customer.create({
                firstName, 
                lastName,
                authorizedUsers,
                companyName,
                phoneNumbers,
                emailAddress,
                notes,
                instructions
            })
        })
        .then(customer => {
            res.status(201).json(customer);
        })
        .catch(err => {
            if(err.reason === 'ValidationError') {
                res.status(err.code).json(err);
            }
            res.status(500).json(err)
        });    
});

// Delete Customer by ID
router.delete('/:id', jwtAuth, (req, res) => {
  const {id} = req.params;
  return Customer.findOneAndDelete({id_: id})
    .then(() => {
        res.status(202).json('deleted');
    })
    .catch(err => {
        res.status(500).json(err)
    });
});

module.exports = router;
