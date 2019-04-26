var express = require('express')
var User = require('../models/user')
var auth = require('../middleware/auth')

var router = new express.Router()

router.post('/users/signUp', async (req,res) => {
    const data = ['name','lastName', 'email', 'password']
    const received = Object.keys(req.body)
    var isValidSignUp = received.length === 4 && received.every(key => data.includes(key))

    if(!isValidSignUp){
       return res.status(400).send({ error: 'Invalid Sign up!' })
    }

    try{
      const user = new User(req.body)
      await user.save()
      const token = await user.generateAuthToken()
      res.status(201).send({user,token})

    }catch (e){
      res.status(400).send(e)
    }

})

router.post('/users/login', async (req,res) => {
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()

    res.send({user,token})

  }catch(e){
    res.status(400).send(e.message)
  }
})

router.post('/users/logout', auth, async (req,res) => {
  try{
    req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
    await req.user.save()

    res.send()
  }catch(e){
    res.status(500).send(e.message)
  }
})

router.post('/users/logoutAll', auth, async (req,res) => {
  try{
    const user = req.user
    user.tokens = []
    await user.save()
    res.send()
  }catch(e){
    res.status(500).send(e.message)
  }
})

router.delete('/users/delete',auth,async (req,res) => {
  try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router
