const express = require("express")
const User = require("../models/user")
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth")
const router = new express.Router()

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get("/",async function(req, res, next) {
    try {
        const users = await User.all()
        return res.json({users})
    } catch (error) {
        return next(error)
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username',async (req, res, next) => {
    try {
        const user = await User.get(req.params.username)
        return res.json({user})
    } catch (error) {
        return next(error)
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/to", async function(req, res, next) {
    try {
        let msg = await User.messagesTo(req.params.username)
        return res.json({msg})
    } catch (error) {
        return next(error)
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', async function(req, res, next) {
    try {
        let msg = await User.messagesFrom(req.params.username)
        return res.json({msg})
    } catch (error) {
        return next(error)
    }
})


 module.exports = router