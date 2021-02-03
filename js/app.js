const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



function getRooms() {
    return fetch('https://matthiasbaldauf.com/swi1hs20/rooms')
        .then((response) => {
            return response.json()
        })
        .then(json => {
            return json
        })
        .catch((err) => {
            console.log('Fetch Error :-S', err)
        });
}