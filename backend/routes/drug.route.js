// routes/drugRoutes.js
const express = require('express');
const router = express.Router();
const { getAllDrugs, getAllCompanies } = require('../controller/drug.controller');

router.get('/', getAllDrugs);
router.get('/companies', getAllCompanies);

module.exports = router;