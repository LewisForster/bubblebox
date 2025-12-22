import mysql from 'mysql2'


let db_con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db_con.connect(function (err) {
    if (err) {
        console.log("Database connection failed", err);
    } else {
        console.log("Connected!");
    }
})

export default db_con;
