const express = require('express');
const router = express.Router();
const AuthController = require('../Authcontroller/authcontroller');
const authmiddleware = require('../middleware/authmiddleware');

router.post('/signup', AuthController.signup);
router.post('/student/login', AuthController.student_login);
router.post('/teacher/login', AuthController.teacher_login);

// Google OAuth Routes
router.get('/auth/google', AuthController.redirectToGoogle);
router.get('/auth/google/callback', AuthController.handleGoogleCallback);

router.get('/students',authmiddleware(['teacher']), AuthController.get_students);
router.get('/teachers', authmiddleware(['student']), AuthController.get_teachers);
router.get('/me', authmiddleware(['student', 'teacher']), AuthController.get_me);

module.exports = router;

