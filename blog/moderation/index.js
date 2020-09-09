const express = require('express'); 
const bodyParser = require('body-parser'); 
const axios = require('axios'); 
const app = express(); 

const PORT = 4003 || process.env.port; 
app.use(bodyParser.json()); 

app.post('/events', async (req, res)=>{
    const {type, data} = req.body;

    if(type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated', 
            data: {
                id: data.id, 
                postId: data.postId, 
                status, 
                content: data.content
            }
        })
    }
    res.send({});
})

app.listen(PORT, ()=>{
    console.log(`Moderation Service is up and listening on port ${PORT}`)
})