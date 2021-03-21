const express = require('express');
app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('This is after dockerfile change!');
})

app.listen(PORT, console.log(`Server is up and running on port: ${PORT}`))