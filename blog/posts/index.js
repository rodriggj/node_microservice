const express = require('express'); 
const bodyParser = require('body-parser'); 
const { randomBytes } = require('crypto'); 
const app = express(); 

const PORT = 4000 || process.env.port; 
const posts = {}; 

app.use(bodyParser.json());

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex'); 
    const { title } = req.body; 
    posts[id] = {
        id, title
    }; 
    res.status(201).send(posts[id]);
}); 
app.get('/posts', (req, res) => {
    res.status(200).send(posts);
}); 

app.listen(PORT, ()=>{
    console.log(`Posts service is up and listening on port ${PORT}`)
});