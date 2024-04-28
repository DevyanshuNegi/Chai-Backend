import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({ // who can access api
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "10kb"}));

app.use(express.urlencoded // for decoding url
    ({extended: true}, {limit:"16kb"}) // optional
)
app.use(express.static("public")) // for images and ...

app.use(cookieParser()) // for storing and reading safe cookies


// routes import

import userRouter from "./routes/user.routes.js"


// routes declaration
// note : previously you would just use app.get() becasue you were doing everything in teh same file
// now : you have to use the middleware which is conpulsary

app.use("/api/v1/users", userRouter) // sends to userRouter file
// here /users will be prefix means url = /users + userRouter

export default app;
export {app};