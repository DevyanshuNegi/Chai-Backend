import 'dotenv/config'

import mongoose from "mongoose"
import {DB_NAME} from "./constants.js"

import connectDB from "./db/index.js"

console.log("hello world")
console.log(process.env.PORT)
connectDB()











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