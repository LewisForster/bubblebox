import db_con from '../../config/db.js'
import bcrypt from "bcrypt";
import passport from 'passport';
import { Strategy } from 'passport-local';
import { passHash } from '../scripts/passHash.js';


// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status - using for http codes


export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username)


    const hash = await passHash(password)
    db_con.beginTransaction(err => {
        const query = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
        db_con.query(query, [username, email, hash], (err, result) => {
            if (err) {
                if (err.errno === 1062) { // Error code for trying to enter duplicate unique values into the db - email is set as a unique value
                    console.log("Email already exists");
                    return db_con.rollback(() => {
                        res.status(409).send("Email already registered")
                    }); //409 - conflict

                } else {
                    console.log("Error with values / inserting into DB: ", err);
                    console.log(err.errno);
                    console.log(err.code);
                    return db_con.rollback(() => {
                        res.status(500).send("Register Error!"); // general error, using 500 with generic message
                    });
                }
            }


            const userID = result.insertId;

            const createTLEntry = 'INSERT INTO tasklist (user_id, list_name) VALUES (?, ?)';
            db_con.query(createTLEntry, [userID, "Untitled"], (err) => {
                if (err) {
                    console.log(err.errno)
                    console.log(err.code)
                    return db_con.rollback(() => {
                        res.status(500).send("Error creating tasklist!")
                    })
                } else {
                    console.log("table created, with userid", result)
                }
            })


            console.log("Row inserted");

            return db_con.commit(() => {
                res.status(201).send("Register success!"); // 201 = created
            })
        });



    });

}



