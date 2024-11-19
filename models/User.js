const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userschema=new mongoose.Schema({

  name:{
    type:String,
    required:[true,'name is required']

  },

  username:{
    type:String,
    required:[true,'username is required'],
    uinque:true,
   

  },
  email:{
    type:String,
    required:[true,'email required'],
    unique:true,
  

  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],

  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user',
  },
  isActive:{
    type:Boolean,
    default:true,
  }
});
userschema.pre('save',async function(next){
  if(this.isModified('password')){
    try{
      const salt=await bcrypt.genSalt(10);
      this.password=await bcrypt.hash(this.password,salt);
    next();
      }catch(err){
        next(err);
      }
  }else{
    next();
  }
  
});


module.exports=mongoose.model('User',userschema)
