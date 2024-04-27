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



export { app }