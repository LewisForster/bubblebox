import db_con from '../../config/db.js'
import express from 'express'
import "../../strategies/local.js";

const router = express.Router();


router.get("/dashboard", (req, res) => {
    const query = 'SELECT list_id, list_name FROM tasklist WHERE user_id= ?';
    db_con.query(query, [req.user.id], (err, result) => {
        if (err) {
            return res.status(500).send("Internal Server Error!")
        } else {
            console.log("sending list names!!")
            console.log(result)
            return res.status(200).json(result);
        }
    })
})
