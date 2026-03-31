import express from 'express'
import { registerUser } from '../controllers/authController.js';
import passport from "passport";
import "../../strategies/local.js";
import db_con from '../../config/db.js'
import { passHash } from '../scripts/passHash.js';
import { sendEmail } from '../scripts/emailer.js'


const router = express.Router();

const { APP_URL_BASE } = process.env


router.post('/register', registerUser);
// router.post('/login', loginUser);


const randomString = length => { // https://medium.com/@terrychayes/adding-password-reset-functionality-to-a-react-app-with-a-node-backend-4681480195d4 - used for logic behind resetpassword
    let text = "";
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789_-";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}


router.post('/forgotPassword', (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email) return res.status(400).json({ message: "No email in request body" });

    console.log("Email received:", req.body.email)


    const token = randomString(40);
    const emailData = {
        to: req.body.email,
        subject: "Bubblebox Password Reset Request",
        text: `Please use the following link to reset your Bubblebox account password: ${APP_URL_BASE}/resetpassword/${token} `,
        html: `<p> Please use the following link to reset your Bubblebox account password.</p><p>${APP_URL_BASE}/resetpassword/${token}</p>`
    };

    db_con.query('SELECT email FROM users WHERE email = ?',
        [req.body.email], (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            if (result.length == 0) {
                return res.status(404).send("Email not found") // guide for reset password didn't have a null check
            }

            db_con.query(
                'UPDATE users SET resetPasswordLink = ? WHERE email = ?',
                [token, req.body.email], (err) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                    sendEmail(emailData)
                    return res.status(200).json({ message: `Email has been sent to ${req.body.email}` })
                }
            )


        }
    )
})

router.post('/api/resetPassword', (req, res) => {
    const { resetPasswordLink, password } = req.body;
    console.log(resetPasswordLink)
    console.log("FULL BODY", req.body)

    passHash(password)
        .then(hash => {
            db_con.query(
                'UPDATE users SET password = ?, resetPasswordLink = NULL where resetPasswordLink = ?',
                [hash, resetPasswordLink],
                (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    return res.status(200).json({ message: "Password reset! Redirecting.." })
                }
            )
        })

})

router.post('/login', function (req, res, next) {

    passport.authenticate('local', function (err, user, email) {
        if (err) {
            console.log(err)
            return res.status(500).send("Error!");
        }
        if (!user) {
            if (email) {
                console.log("wrong password")
                return res.status(401).json({ message: "Incorrect password, did you forget it? ", email: email });
            }

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
        return res.status(404).send("User not found");
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

router.get('/tags/', (req, res) => {
    const { user_id } = req.query;
    const query = 'SELECT * FROM tags WHERE user_id = ?';
    console.log("userID:", user_id)
    db_con.query(query, [user_id], (err, result) => {
        if (err) {
            console.log("error retreiving tags:", err)
            return res.status(500).send(err);
        }
        res.status(200).json(result);
        console.log("tags:", result);
    });
});

router.post('/createTag', (req, res) => {
    const { tag_name, user_id } = req.body;
    const query = 'INSERT INTO tags (tag_name, user_id) VALUES (?, ?)';
    db_con.query(query, [tag_name, user_id], (err, result) => {
        if (err) {
            console.log("error creating tag:", err)
            return res.status(500).send(err);
        } else {
            console.log("tag created:", result);
            return res.status(201).json({ created: true, tagId: result.insertId })
        }
    });
})

router.post('/updateTag', (req, res) => {
    const { tag_id, tag_name, user_id } = req.body;
    const query = 'UPDATE tags SET tag_name = ? WHERE tag_id = ? AND user_id = ?';
    db_con.query(query, [tag_name, tag_id, user_id], (err, result) => {
        if (err) {
            console.log("error updating tag:", err)
            return res.status(500).send(err);
        } else {
            console.log("DB updated:", result)
            return res.status(200).json({ updated: true })
        }
    });
});

router.post('/deleteTag', (req, res) => {
    const { tag_id, user_id } = req.body.params;
    console.log("TAG ID:", tag_id, "USER ID:", user_id)
    const query = 'DELETE FROM tags WHERE tag_id = ? AND user_id = ?';
    db_con.query(query, [tag_id, user_id], (err, result) => {
        if (err) {
            console.log("error deleting tag:", err)
            return res.status(500).send(err);
        } else {
            console.log("Tag deleted:", result)
            return res.status(200).json({ deleted: true })
        }
    });
});

router.get("/auth", (req, res) => {
    if (req.user) {
        res.json({ authenticated: Boolean(req.user), userID: (req.user.id) });
    } else {
        res.json({ authenticated: Boolean(req.user) })
    }
});

router.post("/registeredEmail", (req, res) => {
    const email = req.body
    const query = 'SELECT email FROM users WHERE email = ?'
    db_con.query(query, [email], (err, result) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.status(200).json(result[0])
    })
})

router.get("/boxnames", (req, res) => {
    if (req.user) {
        const query = 'SELECT list_id, list_name FROM tasklist INNER JOIN users ON tasklist.user_id=users.id WHERE user_id = ? ';
        db_con.query(query, [req.user.id], (err, result) => {
            if (err) {
                return res.status(500).send("Internal Server Error!")
            } else {
                console.log("sending list names!!")
                console.log("result boxnames", result)
                return res.status(200).json(result);
            }
        })
    } else {
        console.log("TASK LISTS STILL DONT WORK")
    }
})




export default router;




// https://github.com/jwalton/passport-api-docs?tab=readme-ov-file - helped figure out passport authenticate