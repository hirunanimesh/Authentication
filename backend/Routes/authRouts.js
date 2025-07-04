const express = require('express');
const router = express.Router();
const AuthController = require('../Authcontroller/authcontroller');
const authmiddleware = require('../middleware/authmiddleware');

router.post('/signup', AuthController.signup);
router.post('/student/login', AuthController.student_login);
router.post('/teacher/login', AuthController.teacher_login);

router.get('/students',authmiddleware(['teacher']), AuthController.get_students);
router.get('/teachers', authmiddleware(['student']), AuthController.get_teachers);

module.exports = router;

