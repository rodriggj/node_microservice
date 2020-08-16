const express = require('express'); 
const bodyParser = require('body-parser'); 
const { randomBytes } = require('crypto'); 
const cors = require('cors');
const axios = require('axios'); 
const app = express(); 

const PORT = 4000 || process.env.port; 
const posts = {}; 

app.use(bodyParser.json());
app.use(cors());

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex'); 
    const { title } = req.body; 
    posts[id] = {
        id, title
    }; 

    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated', 
        data: {
            id, title
        }
    });
    
    res.status(201).send(posts[id]);
}); 

app.get('/posts', (req, res) => {
    res.status(200).send(posts);
}); 

app.listen(PORT, ()=>{
    console.log(`Posts service is up and listening on port ${PORT}`)
});