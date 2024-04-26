import express from 'express'
import env from 'dotenv'
const app = express()

env.config();
// console.log(process.env.PORT)

const jokes = [
    { "id": 1, "joke": "first joke" },
    { "id": 2, "joke": "second joke" },
    { "id": 3, "joke": "third joke" },
    { "id": 4, "joke": "fourth joke" },
    { "id": 5, "joke": "fifth joke" },
    { "id": 6, "joke": "sixth joke" },
    { "id": 7, "joke": "seventh joke" }
];


app.get("/", (req, res) => {
    res.send("Hello world");
})

app.get("/api/jokes", (req, res) => {
    res.json(jokes)
})

app.listen(process.env.PORT, () => {
    console.log("Listening on port ", process.env.PORT);
})

