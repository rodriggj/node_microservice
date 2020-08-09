# Section 2: A Mini-Microservices App

## Objectives
- [ ] Project Setup
- [ ] Create `Posts` Service
---

## Section 2: Lecture 10 - Project Setup 
#### `Initial App Setup` Procedures
1. Open a terminal window
```javascript
mkdir blog
cd blog
```

2. Inside of `blog` dir, we want to create our `react client`
```javascript 
npx create-react-app client
```

3. While Step 2 is running, open a second terminal window, nav to the `blog` directory, and in the `blog` directory create a dir called `posts` and nav to `posts` directory
```javascript 
pwd 
// /Users/gabrielrodriguez/Desktop/node_microservices/blog

mkdir posts
cd posts
```

4. Within `posts` we want to `init` a new npm project and install a few packages. 
```javascript
npm init -y
```

```javascript
npm install express cors axios --save
```

```javascript
npm install -g nodemon
```

5. While Step 4 is finishing, open a 3rd terminal window, once again nav to `blog`, and create a 3rd dir called `comments`

```javascript 
pwd
// /Users/gabrielrodriguez/Desktop/node_microservices/blog

mkdir comments
cd comments
```

6. Within `comments` we want to `init` a new npm project and install the same packages we installed in Step 4 for `posts`.

```javascript 
npm init -y
```

```javascript 
npm install express axios cors --save
```

```javascript
npm install -g nodemon
```

7. Now go back and take inventory on all you have done ... 
- [ ] You should have 3 terminal windows open
1. `blog/client` which contains your react app 
2. `posts` which contains an npm project and 4 packages installed (`cors`, `axios`, `express`, & `nodemon`)
3. `comments` which contains an npm project and 4 packages installed (`cors`, `axios`, `express`, & `nodemon`)
---

## Section 2: Lecture 11 - `Posts` Service Creation
#### Procedures 

1. Within the `posts` directory of our `blog` application we want to create initial boilerplate application. 
```javascript 
code index.js
```

2. Within `index.js` write the following ... 
```javascript
const express = require('express'); 
const app = express(); 

const PORT = 4000 || process.env.port; 

app.post('/posts', (req, res) => {}); 
app.get('/posts', (req, res) => {res.send('Hello World.')}); 

app.listen(PORT, ()=>{
    console.log(`Posts service is up and listening on port ${PORT}`)
});
```

3. Go to a browser and test to see if the service is running, 
```javascript 
// Nav to URL of browser
localhost:4000/posts

// verify you see Hello World
```

4. Because we are not connecting this service to a database at this point we need to store our posts into some sort of data structure. Add a `posts` object to store `posts` for the time being. 

```javascript 
const posts = {}; 
```

5. We want all out `posts` to have a unique id for reference purposes. Again most databases will do this, but since we are not using a db, we need to randomly assign a unique id to our `post` objects. Do this by entering the following code ... 
```javascript 
const { randomBytes } = require('crypto'); 
```

6. Now use the `randomBytes` variable within the `app.post` route like so ...
```javascript 
app.post('/posts', (req, res) => {
     const id = randomBytes(4).toString('hex'); 
}); 
```

7. Now lets take a look at the request body that was sent by the user, and create the `post` object record. 

```javascript 
app.post('/posts', (req, res) => {
     const id = randomBytes(4).toString('hex'); 
     const { title } = req.body; 

     posts[id] = {
          id, title
     }; 

     res.status(201).send(posts[id]); 
}); 
```

8. The only remaining thing to do is make sure that our service has a body-parser so when a request is sent the request body can be parsed and with our `req` & `res` variables. 

```javascript
const bodyParser = require('body-parser'); 

app.use(bodyParser.json()); 
```

9. Now that the service is now barebones functional, we should add a start script to the `package.json` file to start the service. Nav to the `package.json` file, and under the `scripts` node, enter the following...

```javascript
"start": "nodemon index.js" 
```

Nav to your terminal window for `posts` and run `npm start` at the CLI to start the `posts` service. 

10. Test the `POST` request in Postman. 

```javascript 
//REQUEST
{
    "title": "Test1234"
}

//RESPONSE
{
   "9da1c9e1": {
           "id": "9da1c9e1",
           "title": "Test1234"
     }
}

---

## Section 2: Lecture 13 - Implementing a `Comments` Service
#### Procedures 

1. Within the `comments` directory of our `blog` application we want to create initial boilerplate application. 
```javascript 
code index.js
```

2. Within `index.js` write the following ... 
```javascript
const express = require('express'); 
const bodyParser = require('body-parser'); 
const { randomBytes } = require('crypto'); 

const app = express(); 

const PORT = 4001 || process.env.PORT; 

app.use(bodyParser.json()); 

app.get('/posts/:id/comments', (req, res) => {
    res.status(200).send('GET comments route')
});

app.post('/posts/:id/comments', (req, res)=>{
    res.status(201).send('Created comment'); 
});

app.listen(PORT, ()=>{
    console.log(`Comments Service is up and listening on port ${PORT}`)
})
```

3. Go to a browser and test to see if the service is running, 
```javascript 
// Nav to URL of browser
localhost:4001/posts

// verify you see GET comments route
```

4. Because we are not connecting this service to a database at this point we need to store our `comments` into some sort of data structure.  This data structure will be a little more complex than the `posts` data structure. We will make a data structure called `commentsByPostId` and provide a structure that looks like the following ... 

```javascript 
const commentsByPostId = {}; 
```
> Note: This is the structure of our `commentsByPostId` object
![image](https://user-images.githubusercontent.com/8760590/89732101-beddf700-da09-11ea-9036-dc596e0493e2.png)

5. To create this `commentsByIdStructure` go to the `POST` route and insert the following code ... 

```javascript
const commentsByPostId = {}; 
```

```javascript 
app.post('posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex'); 
    const { content } = req.body; 
    const comments = commentsByPostId[req.params.id] || [ ]; 
    comments.push({ id: commentId, content}); 
    commentsByPostId[req.params.id] = comments; 
    res.status(201).send(comments); 
}); 
```

6. For the `GET` route insert the following code ... 

```javascript 
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [ ]; 
}); 
```

7. Go to your `package.json` file and ensure to update the `scripts` node with a `start` node ... 

```javascript 
"start": "nodemon index.js"
```

8. Test your `post` and `get` requests using Postman

---