var express = require('express');
const passport = require('passport');
var router = express.Router();

const User = require('../models/User')

// REGISTER routes
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', async (req, res) => {
  const { username, email, password, password2, admin_check, admin_pass } = req.body
  let errors = []

  if(!username || !email || !password || !password2) {
    errors.push({msg: 'Please fill out all fields'})
  }
  if(username.length < 3) {
    errors.push({msg: 'Username must be at least 3 characters in length'})
  }
  if(password != password2) {
    errors.push({msg: 'Passwords do not match'})
  }
  if(password.length < 5) {
    errors.push({msg: 'Password must be at least 5 characters in length'})
  }
  if(admin_check === 'true' && admin_pass !== 'asterisks') {
    errors.push({msg: 'Invalid password for admin privileges'})
  }
  // the user entered invalid credentials
  if(errors.length > 0) {
    res.render('register', {errors})
  } else {
    // check db for a user
    User.findOne({email: email}).then(user => {
      if(user) {
        errors.push({msg: 'Email already exists'})
        res.render('register', {errors})
      } else {
        const newUser = new User({
          username,
          email,
          password, 
          isAdmin: admin_check
        })
        newUser.save()
          .then(()=> {
            res.redirect('/users/login')
          })
          .catch(err => console.error(err))
      }
    })
  }
})
// LOGIN routes
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', async (req, res, next) => {
  await passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login'
  })(req, res, next)
})
// LOGOUT
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router;
