var jwt = require('jsonwebtoken')
var User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismysecret')
        console.log("af");
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        console.log("b");
        if (!user) {
          console.log('here');
            throw new Error()
        }
        req.token = token
        req.user = user
        console.log("yes");
        next()
    } catch (e) {
      console.log("bura girmir");
        res.status(401).send(e.message)
    }
}


module.exports = auth
