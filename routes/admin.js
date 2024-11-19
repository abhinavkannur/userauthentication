const express=require('express');
const router=express.Router();
const User=require('../models/User');

router.get('/adminlogin',(req,res)=>{
  res.render('admin_login')
})
router.post('/adminlogin',async(req,res)=>{
  const {username,password}=req.body;
  try{
    const admin=await User.findOne({username:'admin'})
    if(!admin){
      return res.status(400).send('admin not found');
    }
    if(admin.password !=password){
      return res.status(400).send('incorrect passwords');
    }
    req.session.userId=admin._id;
    req.session.role=admin.role;
    res.redirect('/admindashboard');
  }
  catch(error){
    console.log('error during admin login ',error);
    res.status(400).send('something went wrong');
  }
});

//admindahboard

router.get('/admindashboard',(req,res)=>{
  if(req.session.role=='admin'){
    User.find({role:'user'})
    .then(users=>{
      res.render('admin_panel',{users});
    })
    .catch(error=>{
      console.log('error in fetching data from users',error);
      res.status(500).send('something went wrong');
    });

  }
  else{
    res.redirect('/adminlogin')
  }
});

//admin update

router.get('/update/:id',async(req,res)=>{
  try{
    const user = await User.findById(req.params.id);
    if(!user){
      return res.status(404).send('user not found');
    }
     res.render('update_user',{user});
  }catch (error){
    console.log('error fetching user details:',error);
    res.status(500).send('something went wrong');
  }
});

router.post('/update/:id',async(req,res)=>{
  const {name,username,email,phone}=req.body;
  try{
    await User.findByIdAndUpdate(req.params.id,{name,username,email,phone});
  res.redirect('/admindashboard');
 
  } catch(error){
    console.log('error updating suer details',error);
    res.status(500).send('something went wrong');

  }

});

router.get('/delete/:id',async(req,res)=>{
  try{
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admindashboard');

  }
  catch(error){
    console.log('error in fetching user:',error);
    res.status(500).send('something went wrong');
  }
});



module.exports=router;