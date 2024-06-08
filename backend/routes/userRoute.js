const express = require('express');
const router = express.Router();



const userController = require('../controllers/userController'); 
// router.post('/auth', userController.authUser);


router.post('/signup',userController.registerUser);
router.post('/login', userController.authUser);
router.post('/logout',userController.logoutUser);




module.exports = router;

