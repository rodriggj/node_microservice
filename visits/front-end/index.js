const express = require('express');
const app = express();
const PORT = 4000;

app.get('/', (req, res) => {
    res.send(`You have visited this app X number of times.`)
});

app.listen(PORT, console.log(`Server is up and listening on port: ${PORT}`))