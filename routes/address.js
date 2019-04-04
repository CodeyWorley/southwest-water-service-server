const express = require('express');
const jsonParser = require('body-parser');
const passport = require('passport');
const Address = require('../models/address');

const router = express.Router();

// Auth
const jwtAuth = passport.authenticate('jwt', { session: false });

// Get all Addresses
router.get('/', jwtAuth, (req, res) => {
  return Address.find()
    .then(addresses => {
      res.status(200).json(addresses);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Get Address by ID
router.get('/:id', jwtAuth, (req, res) => {
    const {id} = req.params;
    return Address.findOne({_id: id})
        .then(address => {
            res.status(200).json(address);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// Update Address by ID
router.put('/:id', jsonParser, jwtAuth, (req, res) => {
    const {id} = req.params;
    const toUpdate = {};
    const updateableFields = ['address', 'city', 'state', 'zip', 'community', 'notes', 'isBilling'];

    updateableFields.forEach(field => {
        if (field in req.body) {
        toUpdate[field] = req.body[field];
        }
    });

    return Address.findOneAndUpdate({_id: id}, toUpdate, {new: true})
        .then(results => {
            res.status(200).json(results);
        })
        .catch(err => {
            res.status(500).json(err);
        }); 
});

// Create new Address
router.post('/', jsonParser, jwtAuth, (req, res) => {
    const {customerId, address, city, state, zip, community, notes = [], isBilling} = req.body;
    
    return Address.find({address})
        .count()
        .then(count => {
            if(count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Address already exists',
                    location: 'Address'
                });
            }
            return Address.create({
                customerId,
                address,
                city,
                state,
                zip,
                community,
                notes,
                isBilling
            })
        })
        .then(address => {
            res.status(201).json(address);
        })
        .catch(err => {
            if(err.reason === 'ValidationError') {
                res.status(err.code).json(err);
            }
            res.status(500).json(err)
        });    
});

// Delete Address by ID
router.delete('/:id', jwtAuth, (req, res) => {
  const {id} = req.params;
  return Address.findOneAndDelete({id_: id})
    .then(() => {
        res.status(202).json('deleted');
    })
    .catch(err => {
        res.status(500).json(err)
    });
});

module.exports = router;
