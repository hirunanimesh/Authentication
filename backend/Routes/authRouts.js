const express = require('express');
const router = express.Router();
const AuthController = require('../Authcontroller/authcontroller');
const authmiddleware = require('../middleware/authmiddleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');


router.post('/signup', AuthController.signup);
router.post('/student/login', AuthController.student_login);
router.post('/teacher/login', AuthController.teacher_login);

router.get('/students',authmiddleware(['teacher']), AuthController.get_students);
router.get('/teachers', authmiddleware(['student']), AuthController.get_teachers);
router.get('/me', authmiddleware(['student', 'teacher']), AuthController.get_me);




//new google auth routers
router.get('/google/student', (req, res, next) => {
    console.log("google student route hit");
  req.session.role = 'student';
  console.log(req.session.role);
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/teacher', (req, res, next) => {
 
  req.session.role = 'teacher';

  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

// backend/Routes/authRoutes.js
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;

     console.log("✅ Callback route hit");
    console.log("🔐 User:", req.user);

    const token = jwt.sign({ email: user.email, role: user.role, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    if (user.role === 'student') {
      res.redirect(`${process.env.CLIENT_URL}/student`);
    } else if (user.role === 'teacher') {
      res.redirect(`${process.env.CLIENT_URL}/teacher`);
    }
  }
);



module.exports = router;

