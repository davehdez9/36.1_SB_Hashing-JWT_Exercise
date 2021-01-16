const express = require("express")
const Message = require("../models/message")
const ExpressError = require("../expressError")
const { ensureLoggedIn } = require("../middleware/auth")
const router = new express.Router()

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


router.get("/:id", async (req, res, next) => {
    try {
        const msg = await Message.get(req.params.id)
        return res.json({message: msg})
    } catch (error) {
        return next(error)
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", async (req, res, next) => {
    try {
        const { from_username, to_username, body } = req.body
        let msg = await Message.create({
            from_username: from_username,
            to_username: to_username,
            body: body
        })
        return res.json({message: msg})
    } catch (error) {
        return next(error)
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", async (req, res, next) =>{
    try {
        let message = await Message.markRead(req.params.id)
        return res.json({message})
    } catch (error) {
        return next(error)
    }
})

module.exports = router