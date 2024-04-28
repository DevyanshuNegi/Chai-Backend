import 'dotenv/config'

// import mongoose from "mongoose"
// import {DB_NAME} from "./constants.js"

import connectDB from "./db/index.js"
import app from "./app.js"

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, ()=> {
        console.log("Server is running on port ", process.env.PORT);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})






// sometimes 
/*
import express from "express"
const app = express()
*/

/*
(async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        appBarClasses.on("error", (error)=> {
            console.log("ERRR", error);
            throw error 
        })

        appBarClasses.listen(process.env.PORT, () => {
            console.log("App is listening on port ", process.env.port)
        })
    } catch(error) {
        console.error("ERROR ", error);
        throw err
    }
})*/