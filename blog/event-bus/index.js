const express = require('express'); 
const bodyParser = require('body-parser'); 
const axios = require('axios');
const app = express(); 

const PORT = 4005 || process.env.PORT; 
app.use(bodyParser.json()); 

app.post('/events', (req, res)=>{
    const event = req.body; 
    axios.post('http://localhost:4000/events', event);   //posts service
    axios.post('http://localhost:4001/events', event);   //comments service
    axios.post('http://localhost:4002/events',event);   //query service (TBD)
    res.send( {eventStatus: "OK"} );
});

app.listen(PORT, ()=>{
    console.log(`Event-Bus Service is up and listening on port ${PORT}`)
})