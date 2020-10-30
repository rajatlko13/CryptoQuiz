const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

router.get('/', userController.getList);
router.get('/:id', userController.get);
router.post('/new', userController.add);
router.put('/', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;