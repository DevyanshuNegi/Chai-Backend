import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'


function App() {

 /*const jokess = [
    { "id": 1, "joke": "first joke" },
    { "id": 2, "joke": "second joke" },
    { "id": 3, "joke": "third joke" },
    { "id": 4, "joke": "fourth joke" },
    { "id": 5, "joke": "fifth joke" },
    { "id": 6, "joke": "sixth joke" },
    { "id": 7, "joke": "seventh joke" }
  ];*/

  const [jokes, setJokes] = useState([]);
  console.log("jokes set to ", jokes)

  useEffect(() => {
    axios.get('/api/jokes')
    .then((response) => {
      // console.log("the response is ", response)
      setJokes(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  })

  return (
    <>
      <h1>The Joke Book</h1>

      {jokes.map((joke) => {
        return (
          <div key={joke.id}>
            <p>{joke.joke}</p>
            <hr />
          </div>
        )
      })}

    </>
  )
}

export default App
