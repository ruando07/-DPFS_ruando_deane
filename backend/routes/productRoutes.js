const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');


router.get('/', productsController.list);
router.get('/create', productsController.createForm);
router.get('/:id', productsController.detail);
router.post('/', productsController.create);
router.get('/:id/edit', productsController.editForm);
router.put('/:id', productsController.update);
router.delete('/:id', productsController.delete);

module.exports = router;
