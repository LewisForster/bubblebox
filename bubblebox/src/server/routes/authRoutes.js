import express from 'express'
import { registerUser } from '../controllers/authController.js';
import passport from "passport";
import "../../strategies/local.js";
import session from "express-session";
import db_con from '../../config/db.js'


const router = express.Router();



router.post('/register', registerUser);
// router.post('/login', loginUser);





router.post('/login', function (req, res, next) {

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            console.log(err)
            return res.status(500).send("Error!");
        }
        if (!user) {
            console.log("!user")
            return res.status(500).send("Invalid Credentials!");
        }
        req.login(user, function (err) {
            if (err) {
                console.log("login func")
                console.log(err)
                return res.status(500).send("Login error!")

            }
            console.log("session", req.session)

            return res.status(200).send("Login success! Redirecting...")
        })


    })(req, res, next);
});

router.get("/login", (req, res) => {
    if (req.user) {
        res.status(403).send("Already logged in!")
        res.json({ ok: true });

    }
    else {
        return res.status(401).send("User not found");
    }
})


router.post('/logout', (req, res, next) => {
    req.logout(function (err) { //https://www.passportjs.org/concepts/authentication/logout/
        if (err) {
            return res.status(500).send("Logout error!");
        }
        res.status(200).send("Logout success!");
    })
})




router.get("/auth", (req, res) => {
    res.json({ authenticated: Boolean(req.user) });
});

router.get("/tasknames", (req, res) => {
    if (req.user) {
        const query = 'SELECT list_id, list_name FROM tasklist WHERE user_id = ?';
        db_con.query(query, [req.user.id], (err, result) => {
            if (err) {
                return res.status(500).send("Internal Server Error!")
            } else {
                console.log("sending list names!!")
                console.log(result)
                return res.status(200).json(result);
            }
        })
    } else {
        console.log("TASK LISTS STILL DONT WORK")
    }
})

export default router;




// https://github.com/jwalton/passport-api-docs?tab=readme-ov-file - helped figure out passport authenticate