const express = require('express');
const jsonParser = require('body-parser');
const passport = require('passport');
const Contract = require('../models/contract');

const router = express.Router();

// Auth
const jwtAuth = passport.authenticate('jwt', { session: false });

// Get all Contracts
router.get('/', jwtAuth, (req, res) => {
  return Contract.find()
    .then(contracts => {
      res.status(200).json(contracts);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Get Contract by ID
router.get('/:id', jwtAuth, (req, res) => {
    const {id} = req.params;
    return Contract.findOne({_id: id})
        .then(contract => {
            res.status(200).json(contract);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// Update Contract by ID
router.put('/:id', jsonParser, jwtAuth, (req, res) => {
    const {id} = req.params;
    const toUpdate = {};
    const updateableFields = ['type', 'notes', 'frequency', 'status'];

    updateableFields.forEach(field => {
        if (field in req.body) {
        toUpdate[field] = req.body[field];
        }
    });

    return Contract.findOneAndUpdate({_id: id}, toUpdate, {new: true})
        .then(results => {
            res.status(200).json(results);
        })
        .catch(err => {
            res.status(500).json(err);
        }); 
});

// Create new Contract
router.post('/', jsonParser, jwtAuth, (req, res) => {
    const {customerId, type, notes = [], frequency, status} = req.body;
    
    return Contract.find({customerId, type})
        .count()
        .then(count => {
            if(count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Contract type already exists',
                    location: 'Contract'
                });
            }
            return Contract.create({
                customerId,
                type,
                notes,
                frequency,
                status
            })
        })
        .then(contract => {
            res.status(201).json(contract);
        })
        .catch(err => {
            if(err.reason === 'ValidationError') {
                res.status(err.code).json(err);
            }
            res.status(500).json(err)
        });    
});

// Delete Contract by ID
router.delete('/:id', jwtAuth, (req, res) => {
  const {id} = req.params;
  return Contract.findOneAndDelete({id_: id})
    .then(() => {
        res.status(202).json('deleted');
    })
    .catch(err => {
        res.status(500).json(err)
    });
});

module.exports = router;
