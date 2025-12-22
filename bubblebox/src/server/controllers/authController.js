import db_con from '../../config/db.js'
import bcrypt from "bcrypt";
import passport from 'passport';
import { Strategy } from 'passport-local';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status - using for http codes


export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username)
    const saltRounds = 12;



    bcrypt.hash(password, saltRounds, function (err, hash) {
        const query = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
        db_con.query(query, [username, email, hash], (err) => {
            if (err) {
                if (err.errno === 1062) { // Error code for trying to enter duplicate unique values into the db - email is set as a unique value
                    console.log("Email already exists");
                    return res.status(409).send("Email already registered"); //409 - conflict
                } else {
                    console.log("Error with values / inserting into DB: ", err);
                    console.log(err.errno);
                    console.log(err.code);
                    return res.status(500).send("Internal Server Error"); // general error, using 500 with generic message
                }
            }

            console.log("Row inserted");
            return res.status(201).send("Register success!"); // 201 = created
        });



    });
}

// export const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     const findUser = "SELECT * FROM users WHERE email = ?";
//     db_con.query(findUser, [email], (err, result) => {
//         if (err) {
//             console.log("Error finding user", err);
//             return res.status(500).send("Internal Server Error");
//         }
//         if (result.length === 0) {
//             console.log("User not found");
//             return res.status(404).send("User Not Found!"); // 404 not found
//         }
//         console.log("User found");

//         const user = result[0];

//         bcrypt.compare(password, user.password, function (err, result) {
//             if (err) {
//                 console.log("Error:", err);
//                 return res.status(500).send("Internal Server Error");
//             }

//             switch (result) {
//                 case true:
//                     console.log("Credentials match");
//                     return res.status(200).send("Login Success! Redirecting...");

//                 case false:
//                     console.log("Invalid Credentials");
//                     return res.status(400).send('Invalid credentials!'); //bad request - invalid credentials

//                 default:
//                     console.log("A server error occured");
//                     return res.status(500).send("Internal Server Error!")
//             }
//         });
//     })
// };


