const express = require('express');
const router = express.Router();
const AuthController = require('../Authcontroller/authcontroller');

router.post('/signup', AuthController.signup);
router.post('/student/login', AuthController.student_login);
router.post('/teacher/login', AuthController.teacher_login);

module.exports = router;

