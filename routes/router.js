const express = require('express');
const router = express.Router();
const api = require('../api');

/* GET environments */
router.get('/environments', (req, res) =>
{
    res.json({ environments: api.getSortedEnvironments() });
});

// POST ENVIRONMENTS

module.exports = router;