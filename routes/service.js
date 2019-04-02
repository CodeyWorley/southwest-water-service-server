const express = require('express');
const passport = require('passport');
const Service = require('../models/service');

const router = express.Router();

// Auth
const jwtAuth = passport.authenticate('jwt', { session: false });

// Get all Services
router.get('/', jwtAuth, (req, res) => {
  return Service.find()
    .then(services => {
      res.status(200).json(services);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Get Service by ID
router.get('/:id', jwtAuth, (req, res) => {
    const {id} = req.params;
    return Service.findOne({_id: id})
        .then(service => {
            res.status(200).json(service);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// Update Service by ID
router.put('/:id', jsonParser, jwtAuth, (req, res) => {
  const {id} = req.params;
  const toUpdate = {};
  const updateableFields = ['type', 'price', 'description', 'scheduledDate', 'scheduledTime', 'status', 'technicianId'];

  updateableFields.forEach(field => {
    if (field in req.body) {
    toUpdate[field] = req.body[field];
    }
  });

  return Service.findOneAndUpdate({_id: id}, toUpdate, {new: true})
    .then(results => {
      res.status(200).json(results);
    })
    .catch(err => {
      res.status(500).json(err);
    }); 
});

// Create new Service
router.post('/', jsonParser, jwtAuth, (req, res) => {
  const {customerId, type, price = 0.00, description = '', scheduledDate, scheduledTime, status, technicianId} = req.body;
  
  return Service.create({
    customerId,
    type,
    price,
    description,
    scheduledDate,
    scheduledTime,
    status,
    technicianId
  })
  .then(service => {
    res.status(201).json(service);
  })
  .catch(err => {
    if(err.reason === 'ValidationError') {
      res.status(err.code).json(err);
    }
    res.status(500).json(err)
  });    
});

// Delete Service by ID
router.delete('/:id', jwtAuth, (req, res) => {
  const {id} = req.params;
  return Service.findOneAndDelete({id_: id})
    .then(() => {
      res.status(202).json('deleted');
    })
    .catch(err => {
      res.status(500).json(err)
    });
});

module.exports = router;
