var mongoose = require('mongoose')
var validator = require('validator')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'User name is required']
  },

  lastName:{
    type: String,
    trim: true,
    required: [true, 'User lastname is required']
  },

  email:{
    type: String,
    trim: true,
    index: {
      unique: true
    },
    lowercase: true,
    required: [true, 'User email is required'],
    validate(email){
      if(!validator.isEmail(email)){
          throw new Error('Email is invalid!')
      }
    }
  },

  password:{
    type: String,
    minlength: 7,
    trim: true,
    required: [true, 'User password is required']
  },

  age:{
    type: Number,
    default: 18,
    validate(age){
      if(age<0){
        throw new Error('Age cannot be negative!')
      }
    }
  },

  tokens:[{
    token:{
      type: String,
      required: true
    }
  }]
},{
  timestamps: true
})

userSchema.methods.generateAuthToken = async function(){
  const user = this
  const token = await jwt.sign({_id: user._id}, 'thisismysecret')

  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error("Unable to login")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error("Unable to login")
  }

  return user
}

// Hash the plaintext password before saving it to database
userSchema.pre('save', async function(next){
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
  }

  next()
})

var User = new mongoose.model('User', userSchema)

module.exports = User
