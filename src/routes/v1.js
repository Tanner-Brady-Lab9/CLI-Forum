'use strict';

const express = require('express');
const dataModules = require('../models');
const bearerAuth = require('../auth/middleware/bearer');
const authorize = require('../auth/middleware/acl.js');

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

// route will be ---- (/api/v1/posts)
router.get('/:model', bearerAuth, authorize('user'), handleGetAll);
router.get('/:model/:id', bearerAuth, authorize('user'), handleGetOne);
router.post('/:model', bearerAuth, authorize('writer'), handleCreate);
router.put('/:model/:id', bearerAuth, authorize('editor'), handleUpdate);
router.delete('/:model/:id', bearerAuth, authorize('admin'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  console.log(JSON.stringify(allRecords));
  res.status(200).json(allRecords);
  
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}


module.exports = router;