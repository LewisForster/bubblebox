import express from 'express';
import cors from 'cors';
import session from "express-session";
import passport from "passport";
import "../strategies/local.js";
import authRoute from "./routes/authRoutes.js"




const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
})
);
app.use(express.json())


app.use(
    session({
        secret: "tempchangeitlewis",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        }
    }));


app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoute);


const PORT = process.env.DB_SERVER_PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

