const express = require('express');
const redis = require('redis');
const app = express();
const client = redis.createClient({
    //we can reference this by name because we are using docker-compose, otherwise this would be an endpoint
    host: 'redis-server',
    port: 6379
});
const PORT = 4000;

client.set('visits', 0);

app.get('/', (req, res) => {
    client.get('visits', (err, visits) => {
        res.send('Number of visits is ' + visits);
        client.set('visits', parseInt(visits) + 1);
    })
    res.send('This is the new docker bld with redis temp disabled')
});

app.listen(PORT, console.log(`Server is up and listening on port: ${PORT}`))