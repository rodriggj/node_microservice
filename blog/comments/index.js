const express = require('express'); 
const bodyParser = require('body-parser'); 
const { randomBytes } = require('crypto'); 
const axios = require('axios');
const cors = require('cors');

const app = express(); 

const PORT = 4001 || process.env.PORT; 
const commentsByPostId = {}; 

app.use(bodyParser.json()); 
app.use(cors()); 

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res)=>{
    const commentId = randomBytes(4).toString('hex'); 
    const { content } = req.body; 
    const comments = commentsByPostId[req.params.id] || []; 
    comments.push({id: commentId, content})
    commentsByPostId[req.params.id] = comments;
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated', 
        data: {
            id: commentId, 
            content, 
            postId: req.params.id
        }
    });
    res.status(201).send(comments); 
});

app.post('/events', (req, res) => {
    console.log('Received event:', req.body.type); 
    res.status(200).json({message: "Event from event bus received."})
})

app.listen(PORT, ()=>{
    console.log(`Comments Service is up and listening on port ${PORT}`)
})
