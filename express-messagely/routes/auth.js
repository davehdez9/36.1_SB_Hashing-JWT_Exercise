const jwt = require("jsonwebtoken")
const express = require("express")
const router = new express.Router()

const User = require("../models/user")
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config")
const ExpressError = require('../expressError')



/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body

        if(!username || !password){
            throw new ExpressError("Username and Password Required", 400)
        }

        if(await User.authenticate(username, password)){
            const token = jwt.sign({username}, SECRET_KEY)
            User.updateLoginTimestamp(username)
            return res.json({message: `Logged in!`, token})
        } else {
            throw new ExpressError(`Invalid username/password`, 400)
        }
    } catch (error) {
        return next(error)
    }
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async (req, res, next) => {
    try {
        const { username } = await User.register(req.body)
        const token = jwt.sign({username}, SECRET_KEY)
        User.updateLoginTimestamp(username)
        return res.json({token})
    } catch (error) {
        if(error.code === '23505'){
            return next(new ExpressError("Username taken, Please pick another", 400))
        }
        return next(error)
    }
})
module.exports = router