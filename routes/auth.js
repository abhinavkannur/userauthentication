const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs')

router.get('/signup',(req,res)=>{
  res.render('signup');
})
router.get('/login',(req,res)=>{
  res.render('login');
})

router.get('/',(req,res)=>{
  res.redirect('/login')
})

router.post('/signup',async(req,res)=>{
  const {name,username,email,phone,password}=req.body;
  try{
    const user=new User({name,username,email,phone,password});
    await user.save();
    req.session.userId=user._id;
    res.redirect('/home');
  }
  catch(error){
    console.log('signup error:',error)
    res.status(400).send('error during singup. username or email might alraadyb exits')
  }

});
router.get('/home', (req, res) => {
  // Assuming userId is stored in the session and you have a User model to fetch user data
  if (req.session.userId) {
    User.findById(req.session.userId)
      .then(user => {
        res.render('home', { username: user.username }); // Pass username to the view
      })
      .catch(error => {
        console.log('Error fetching user:', error);
        res.status(500).send('Something went wrong.');
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/logout',(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      console.lof('error in log out',err);
      return res.status(500).send('something wrong');
    }
    res.redirect('/login')
  })
})
 
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Compare the hashed password stored in the database with the entered password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Incorrect password');
    }

    // Set session
    req.session.userId = user._id;
    console.log('Session initialized', req.session);
    res.redirect('/home');
  } catch (error) {
    console.log('Error in login', error);
    res.status(500).send('Something went wrong');
  }
});




   
  


module.exports=router