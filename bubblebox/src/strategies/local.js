import passport from 'passport';
import { Strategy } from 'passport-local';
import db_con from '../config/db.js'
import bcrypt from 'bcrypt';
import session from "express-session";


passport.use(new Strategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        const findUser = 'SELECT * FROM users WHERE email = ?'
        db_con.query(findUser, [email], (err, result) => {
            if (err) {
                console.log("Error finding user", err);
                return done(err);
            }
            if (result.length === 0) {
                console.log("User not found!");
                return done(null, false);
            }
            console.log("User found!")
            const user = result[0]
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    console.log("Error finding user", err);
                    return done(err);
                }
                switch (result) {
                    case true:
                        console.log("Credentials match");
                        return done(null, user);

                    case false:
                        console.log("Invalid credentials");
                        return done(null, false);

                    default:
                        console.log("A server occurred")
                        return done(null, err);
                }
            });
        });
    }
));

passport.serializeUser(function (user, done) {
    console.log("Serializing user")
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    const findUser = "SELECT * FROM users WHERE id = ?";
    db_con.query(findUser, [id], (err, result) => {
        if (err) {
            return done(err);
        }
        console.log("deserializing user", id)
        done(null, result[0]);
    });
});


// https://www.youtube.com/watch?v=zb8VPxpm_ME
// https://stackoverflow.com/questions/15362135/passportjs-local-strategy-cannot-be-found

// based off code from authController login function