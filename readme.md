# Section 2: A Mini-Microservices App

## Objectives
- [ ] Several ... 
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
```
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

## Section 2: Lecture 16 - React Project Setup
#### Procedures

1. Nav to the `client` folder in the dir structure and open the code editor. 

```javascript
pwd 
// /Users/gabrielrodriguez/Desktop/node_microservices/blog/client
```
2. We have yet to install any packages on the `client` node of our `blogs` application. So first step is to install `axios` to the `client` app. 

```javascript 
npm install axios --save
```

3. Once the install of `axios` completes, run an `npm start` to start the `client` application. 

```javascript 
npm start
```

> NOTE: When you start the react application if you didn't modify any of the boilerplate code you will get a UI that renders. Also by default React will start on port 3000. So if you did nothing to the `public` or `src` folder(s) in the boiler plate you may see something like this. 
![image](https://user-images.githubusercontent.com/8760590/89733169-d2409080-da10-11ea-8da7-8f3e1caacd28.png)

4. Go into the `src` folder and delete all the content that was there per the boilerplate.

> NOTE: When you do this you will be deleting the `index.js` file which rendered the boilerplate UI, so you will now see something like this via a browser. 
![image](https://user-images.githubusercontent.com/8760590/89733218-3d8a6280-da11-11ea-85ea-b536b929fd8c.png)

5. Now inside the `src` dir, lets restart by creating 2 files ... 

```javascript 
pwd 
// /Users/gabrielrodriguez/Desktop/node_microservices/blog/client/src

touch index.js && touch App.js
```

6. Inside of `App.js` type the following code ...

```javascript 
import React from 'react'; 

export default() => { 
    return <div>Blog app</div>; 
};
```

7. Now switch to the `index.js` file and write the following code ...

```javascript
import React from 'react'; 
import ReactDOM from 'react-dom'; 
import App from './App'; 

ReactDOM.render(
     <App />, 
     document.getElementById('root'); 
); 

8. Now go back to the `client` server and restart the application by running ... 
```javascript 
npm start
```

9. Go to a browser window ... 
```javascript 
// In URL of browser window type 
localhost:3000/
```

> NOTE: You should see the UI that has nothing more than `Blog App` at this point.
 
![image](https://user-images.githubusercontent.com/8760590/89736760-f8722a80-da28-11ea-9c86-faad0ea975c8.png)

---

## Section 2: Lecture 17 - Building Post Submission
#### Procedures

1. Nav to `client` dir, and nav to `src` dir, and create a new file called `PostCreate.js`

```javascript
pwd 
///Users/gabrielrodriguez/Desktop/node_microservices/blog/client

cd src && code PostCreate.js
```

2. In `PostCreate.js` lets create a basic form and a submit button ...

```javascript
import React from 'react'; 

export default() => {
    return <div>
        <form>
            <div className="form-group">
                <label>Title</label>
                <input className="form-control"></input>
            </div>
            <button className='btn btn-primary'>Submit</button>
        </form>
    </div>
}
```

3. Now lets make sure to import this component into our react App. So nav to `src/App.js` and add the `PostCreate` component reference. 

```javascript 
import React from 'react'; 
import PostCreate from './PostCreate'

export default() => {
    return <div>
        <h1>Create Post</h1>
        <PostCreate/>
    </div>;
}
```

4. Now you can go to your `localhost:3000` URL on a browser tab and see the form displayed. 

![image](https://user-images.githubusercontent.com/8760590/90313906-3f4e9d00-decd-11ea-9209-0bfff5ae3670.png)

5. To make the application look a little better, let's add `bootstrap` to the project by linking to the `bootstrap cdn`. 

- Go to the Bootstrap homepage [here](https://getbootstrap.com/)
- Nav within Boostrap to `downloads`. You don't need to download the files, instead simply copy the `CDN` url. [here](https://getbootstrap.com/docs/4.5/getting-started/download/)

![image](https://user-images.githubusercontent.com/8760590/90313994-b84df480-decd-11ea-9a55-d406fc8fde43.png)

6. Add the Bootstrap CDN reference to your Application, by naving back to the `/client/public/index.html` file and anywhere inside the `head` element paste the `CDN` code from bootstrap. 

> NOTE: You don't need the `<script></script>` tag in the Bootstrap CDN reference, so you can DELETE the script from your copy paste, and just leave the `<link></link>` tag in the `<head>`. 

7. You can now return to your browser and your formatting of the `posts` form should be updated because you are now leveraging the `css` styling coming from `Bootstrap` along with your element `className` attribute references. 

![image](https://user-images.githubusercontent.com/8760590/90314135-a751b300-dece-11ea-9970-3268de445c6b.png)

8. The last styling change we can make is to wrap the current content of the app in a `container` so we can provide some padding to the edges of our UI. Nav to the `/client/src/App.js` file, and in the parent `div` add the `className=container`. 

```javascript 
// client/src/App.js

import React from 'react'; 
import PostCreate from './PostCreate'

export default() => {
    return <div className='container'>
        <h1>Create Post</h1>
        <PostCreate/>
    </div>;
}
```

> NOTE: Now the UI is padded on the left & right edges. 
![image](https://user-images.githubusercontent.com/8760590/90314198-26df8200-decf-11ea-9bde-298c0afb1595.png)

9. Now that the UI is built, we need to add the functionality that would take the form submission and actually execute a `post` request to our `POSTS` service. To do this lets start by adding an `eventHandler` to listen for any input to the form. Nav back to `/client/src/PostCreate.js` file. 

```javascript 
// First execute some imports, modify the initial import statement as follows to add `useState`
import React, { useState } from 'react'; 

// Next import axios to provide a method to make API calls
import axios from 'axios'

// now create a var to use state 
const [title, setTitle] = useState(' '); 

// use the title state as the value for our input and add an onChange handler
<input value = {title} onChange = { e => setTitle(e.target.value)}

// add on an event listener to the form element
<form onSubmit = {onSubmit}>

// Overall code should look like this ... 

import React, { useState } from 'react'; 
import axios from 'axios'; 

export default() => {
    const [title, setTitle] = useState('');

    return <div>
        <form onSubmit = {onSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="form-control"></input>
            </div>
            <button className='btn btn-primary'>Submit</button>
        </form>
    </div>
}
```

10. With step 9 complete we need to write the `onSubmit` function that will execute the activity we want to perform when the event is handled. Start by simply creating the function. 

```javascript 
const onSubmit = () => {

};
```
11. Now by default the browser is going to try to submit the form with default functionality; we want to prevent this because we want to define the functionality of an API call to our `posts` service using axios. So to do this, start by adding an event to the `onSubmit` function, and then on the event object, call `preventDefault()` to prevent the browser default functionality. 

```javascript 
const onSubmit = (event) => {
     event.preventDefault(); 
};
```

12. Now lets prepare our call to the `posts` service. We want to make an `async` call without using promises &/or callbacks, so ensure the function uses `async/await` syntax, and then use axios to make a post to the `posts` service endpoint. 

```javascript 
const onSubmit = async (event) => {
    event.preventDefault(); 
    await axios.post('http://localhost:4000/posts', {
             title
        });
};
```

13. Last house cleaning item to add to the function is after a string is input into the form (which will become the `post` title), lets blank out the form value so a subsequent request can be made from a fresh form field without having to delete the previous submit title. 

```javascript 
const onSubmit = async (event) => {
    event.preventDefault(); 
    await axios.post('http://localhost:4000/posts', {
             title
        });
    setTitle(' '); 
};

// The completed function should look like this 
import React, { useState } from 'react'; 
import axios from 'axios'; 

export default() => {
    const [title, setTitle] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault(); 
        await axios.post('http://localhost:4000/posts', {
            title
        })
        setTitle('');
    }

    return <div>
        <form onSubmit = {onSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="form-control"></input>
            </div>
            <button className='btn btn-primary'>Submit</button>
        </form>
    </div>
}
```
14. Now go and test. Open up the Google Chrome tools to view the `Network` tab and ensure the calls are executing as expected. NOTE... the call `WILL NOT` work. We will have to handle `cors` error. This will be addressed in the next lecture. 

![image](https://user-images.githubusercontent.com/8760590/90314932-a91e7500-ded4-11ea-9e06-e9ff97b5ae8a.png)

> NOTE: If you see any other errors, check and make sure you have your `posts` service running. And also check to make sure that your axios call is to the URL has the correct port reference. 

---

## Section 2: Lecture 18 - Handling `CORS` Errors
#### Procedures

1. We need to install the npm `cors` package on both our `posts` and `comments` servers. We need to do so there because our `App.js` runs on our `client` server which will have a different domain than our `posts` and `comments` servers, and that is where the browser is doing a comparison of source and destination. 

2. Go to `posts` terminal and install `cors`

```javascript 
pwd
// /Users/gabrielrodriguez/Desktop/node_microservices/blog/posts

// install cors package
npm install cors --save
```

3. Go to `comments` terminal and install `cors` 

```javascript 
pwd
// /Users/gabrielrodriguez/Desktop/node_microservices/blog/comments

// install cors package
npm install cors --save
```

4. Now start back up both your `posts` and `comments` services 

```javascript 
// go to terminal for `posts` service 

pwd 
// /Users/gabrielrodriguez/Desktop/node_microservices/blog/posts

npm start

// switch to `comments` terminal 

pwd 
// /Users/gabrielrodriguez/Desktop/node_microservices/blog/comments

npm start
```

![image](https://user-images.githubusercontent.com/8760590/90315434-d0774100-ded8-11ea-86d3-1ac592643cb3.png)


5. Nav to `posts/index.js` file and implement the `cors` package and middleware

```javascript 
// at the top of the file require cors
const cors = require('cors'); 

// in your middleware section (before your routes) ... implement cors middleware
app.use(cors()); 
```

6. Nav to `comments/index.js` file and repeat process from Step 4. 

```javascript 
// at the top of the file require cors
const cors = require('cors'); 

// in your middleware section (before your routes) ... implement cors middleware
app.use(cors()); 
```

7. Now go back to the browser and attempt the post submission again. 

You can see from the Google Chrome Dev Tools - Network Tab that the post submission returned a `201`. 
![image](https://user-images.githubusercontent.com/8760590/90316284-66619a80-dede-11ea-98f0-c5227d9ef60a.png)


No visible errors on the Google Chrome Dev Tools - Console that there are no errors. 
![image](https://user-images.githubusercontent.com/8760590/90315948-b0e21780-dedc-11ea-8d1a-ac29051a11c8.png)

8. Finally you can go to the Postman collection, and execute a GET request and ensure that your test is visible. 

![image](https://user-images.githubusercontent.com/8760590/90316311-86915980-dede-11ea-8d3e-9e88c7e5f6ff.png)

> NOTE: Troubleshooting. While testing my Postman collection I noticed in my `client/src/PostCreate.js` file I forgot to add the word `post` after my axios call and I was not getting a 201 even though I was getting a 200. 

---

## Section 2: Lecture 19 - Fetching and Rendering Posts
#### Procedures

1. Nav back to `/client/src` dir and create a file called `PostList.js`. This will be the component for rendering Post objects to the UI. 

```javascript 
pwd 

///Users/gabrielrodriguez/Desktop/node_microservices/blog/client/src

code PostList.js
```

2. Enter boilerplate React components 

```javascript 
import React from 'react'; 

export default() => {
    return <div/>
}
```

3. Make sure to add this component to the `App.js` file

```javascript 
// Nav to /client/src/App.js file

import React from 'react'; 
import PostCreate from './PostCreate'
import PostList from './PostList'

export default() => {
    return <div className='container'>
        <h1>Create Post</h1>
        <PostCreate/>
        <hr></hr>
        <h1>Posts</h1>
        <PostList/>
    </div>;
}
```
>NOTE: In your browser you can validate that the `PostList` component was added 
![image](https://user-images.githubusercontent.com/8760590/90316998-86e02380-dee3-11ea-8f94-8a5929c4fa76.png)

3. Return back to the `PostList.js` file to continue to buildout what is required to be rendered. The next thing we'll need to do is to import some hooks from React that will help us manage state and the effect desired. The state will be for the Post titles and the effect will be to only load them on page load. We will also need to include the `axios` import to make fetch calls to the Post service.  To do this modify your `PostList.js` file to include the following ... 

```javascript 
import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 

export default() => {
    return (
        <div />
    )
}
```

4. Now lets manage our `state` we'll need to get our posts and set them to do this we'll add this variable. 

```javascript 
import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 

export default() => {
    const [posts, setPosts] = useState(); 
    return (
        <div />
    )
}
```

5. Now we have to provide an initial value for the `useState()` function. Recall from our Posts service that we are presently storing our `posts` created in an '{}' object. So we want to provide an object reference as a parameter for our `useState` function.  

```javascript
export default() => {
    const [posts, setPosts] = useState({}); 
    return (
        <div />
    )
}
```

6. Now we need to define a function that will actually fetch the `posts` from our API. 

```javascript
export default() => {
    const [posts, setPosts] = useState(); 
     
    const getPosts = async () => {
    const res = await axios.get('http://localhost:4000/posts'); 
   }

    return (
        <div />
    )
}
```

7. As a reminder, anytime we assign the response from the `axios.get` function to a variable, javascript will return an `Object` with a `data` attribute. So in this implementation we will pass the `res.data` to the `setPosts` state. 

```javascript 
export default() => {
    const [posts, setPosts] = useState(); 
     
    const getPosts = async () => {
    const res = await axios.get('http://localhost:4000/posts');
    setState(res.data);  
   }

    return (
        <div />
    )
}
```
8. Now that this function is put together we just need to decide now, when to call it, which is why we have the `useEffect` hook. `useEffect` can be used to run code at a specific time in the lifecycle of a component. In this case we want to run `getPosts` once, on window load. To do that we will implement like this ... 

```javascript 
export default() => {
    const [posts, setPosts] = useState(); 
     
    const getPosts = async () => {
    const res = await axios.get('http://localhost:4000/posts');
    setState(res.data);  
   }

    useEffect(()=>{
        getPosts();
    }, [])

    return (
        <div />
    )
}
```

>NOTE: By passing no parameters, and an empty array `[]` to the `useEffect` hook we will be telling React, execute this on window load, and only run `getPosts` 1 time. 

9. As a test to the developer... you may want to add a `console.log` to view the `posts` state. 

```javascript 
export default() => {
    const [posts, setPosts] = useState(); 
     
    const getPosts = async () => {
    const res = await axios.get('http://localhost:4000/posts');
    setState(res.data);  
   }

    useEffect(()=>{
        getPosts();
    }, [])

    console.log(posts); 

    return (
        <div />
    )
}
```

10. Test on the front end to see if it works ... 

You can see that on window load the `GET` call for `PostList` executed and returned a `200`

![image](https://user-images.githubusercontent.com/8760590/90317707-7aaa9500-dee8-11ea-8e47-8934bae7df69.png)

11. You can now delete the `console.log` and let's replace it with the following . We will create a variable `renderedPosts` and assign it using a javascript `out-of-the-box`object => `Object` and use the `values()` method. `Object.values()` will take whatever parameter you pass and return an array. So if we pass `Object.values(posts)` we will return an array of post Objects that we assign to `renderedPosts`.  

```javascript 
export default() => {
    const [posts, setPosts] = useState(); 
     
    const getPosts = async () => {
    const res = await axios.get('http://localhost:4000/posts');
    setState(res.data);  
   }

    useEffect(()=>{
        getPosts();
    }, [])

    const renderedPosts = Object.values(posts); 

    return (
        <div />
    )
}
```

12. We can take it one step further by chaining the `map()` function to `Object.values(posts)` and what this will do is iterate over each object in the array, and execute a callback function we define. In this case we can specify some `JSX` that we can then rendered back to the UI. The subsequent code would look like this... 

```javascript 
import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 

export default() => {

    const [posts, setPosts] = useState({}); 

    const getPosts = async () => {
        const res = await axios.get('http://localhost:4000/posts')
        setPosts (res.data); 
    }

    useEffect(()=>{
        getPosts(); 
    }, [])

    const renderedPosts = Object.values(posts).map(post => {
        return <div className="card" style={{ width: '30%', marginBottom:'20px' }} key={post.id}>
            <div>
                <h3>{post.title}</h3>
            </div>
        </div>
    })

    return (
        <div>
            {renderedPosts}
        </div>
    )
}
```

>NOTE: Note a few things: 1. in the `map()` function we pass a var called `post` which represents each index in the `Object.values(posts)` array. 2. when we return the `JSX` (aka html with embedded javascript binding) **REACT** as a framework requires that you pass a `key` attribute. This is specific to REACT. 3. The `renderedPosts` will continue the output of all this iteration and formulation of HTML and it has to be displayed somewhere. The `where` is in the final return statement between the `<div>` tags. This will render the output of all the `JSX` code. 

13. We want to format the final `div` returned to the UI with some bootstrap so we will pass a few `classNames` to the final div for formatting purposes.

```javascript 
import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 

export default() => {

    const [posts, setPosts] = useState({}); 

    const getPosts = async () => {
        const res = await axios.get('http://localhost:4000/posts')
        setPosts (res.data); 
    }

    useEffect(()=>{
        getPosts(); 
    }, [])

    const renderedPosts = Object.values(posts).map(post => {
        return <div className="card" style={{ width: '30%', marginBottom:'20px' }} key={post.id}>
            <div>
                <h3>{post.title}</h3>
            </div>
        </div>
    })

    return (
        <div className="d-row flex-row flex-wrap justify-content-between">
            {renderedPosts}
        </div>
    )
}
```

14. The resulting output will look something like this ... 

![image](https://user-images.githubusercontent.com/8760590/90318198-1c7fb100-deec-11ea-8578-0fcfe57fcc8d.png)

## Section 2: Lecture 20 - Creating Comments
#### Procedures

1. in `client/src/` dir create a new file called `CommentCreate.js`

```javascript 
pwd 
// /Users/gabrielrodriguez/Desktop/node_microservices/blog/client/src

code CommentCreate.js
```

2. In `CommentCreate.js` implement boilerplate code 

```javascript
import React from 'react'; 

export default() => {
    return <div/>
}
```

3. Recall that a `comment` object will be associated with a `post`. Specifically the `postId`. So when we create a comment in the `CommentCreate` component we should expect to receive some `properties`that are passed in the `default()` method. We could pass a var to `default()` but we know that we only need an id so we can use destructuring and pass the propId like this...

```javascript 
import React from 'react'; 

export default({propId}) => {
    return <div></div>
}
```

4. The component will require a form, so we can go ahead and build that into our return block `div`. 

```javascript 
import React from 'react'; 

export default({postId}) => {
    return <div>
        <form className="form-group">
            <label>New Comment</label>
            <input className="form-control"></input>
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
}
```

5. Now just like the other services we need to manage a few things: 
    + we need to manage the piece of state that will be passed in the form input
    + we need a function that will handle the call to the `comments` service
    + We need to add an event listener to handle the form input 
So just like before, lets start by using the `{useState}` hook that is going to manage the state of the `input` field we created. To do this import `{useState}` from React, and set up a variable that will hold the state. We also need to assign a value for the `input` and create an event handler to listen fo when the input field has content. 

```javascript
import React, { useState } from 'react'; 

export default({postId}) => {
    const [content, setContent] = useState(''); 

    return <div>
        <form onSubmit={onSubmit} className="form-group">
            <label>New Comment</label>
            <input value={content} onChange={e => setContent(e.target.value)} className="form-control" ></input>
            <br></br>
            <div className="text-center">
                <button className="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
}
```

6. Now lets import `axios` and write a function that will perform the call to the `comments` service to post a new comment and associate it with the correct `post`. To do this we will write a `onSubmit` function, and assign an event listener to the `form` element. The function will handle the call to create the post to the `comments` service and will use the `{postId}` that we pass in the `export default({postId})` function. Finally I inserted a `console.log()` to help identify that the function was called & to id the `postId`. 

```javascript
import React, { useState } from 'react'; 
import axios from 'axios'; 

export default({postId}) => {
    const [content, setContent] = useState(''); 

    const onSubmit = async (event) => {
        event.preventDefault(); 
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
            content
        });
        setContent('');
        console.log(`Comment posted to ${postId}`)
    }

    return <div>
        <form onSubmit={onSubmit} className="form-group">
            <label>New Comment</label>
            <input value={content} onChange={e => setContent(e.target.value)} className="form-control" ></input>
            <br></br>
            <div className="text-center">
                <button className="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
}
```

7. Now that we have a way to create a comment, recall that each comment needs to be associated with a `post`. So in our `PostList` component, we need to call `CommentCreate` component to render the `comments` along with each associated `post` in our UI. To do this, go back to the `PostList` component (`/client/src/PostList.js`). In there we want to import our `CreateComment` component and we also want to call our `<CreateComment/>` element within our markup. 

```javascript 
// PostList.js file

import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 
import CommentCreate from './CommentCreate';

export default() => {

    const [posts, setPosts] = useState({}); 

    const getPosts = async () => {
        const res = await axios.get('http://localhost:4000/posts')
        setPosts (res.data); 
    }

    useEffect(()=>{
        getPosts(); 
    }, [])

    const renderedPosts = Object.values(posts).map(post => {
        return <div className="card" style={{ width: '30%', marginBottom:'20px' }} key={post.id}>
            <div className="card-body">
                <h3>{post.title}</h3>
                <CommentCreate postId={post.id}/>
            </div>
        </div>
    })

    return (
        <div className="row d-row flex-row flex-wrap justify-content-between">
            {renderedPosts}
        </div>
    )
}
```

8. Now you can test the front-end and see that for each `Post` card, you should have a form input to create & submit a `comment`. If you attempt to create a `comment` the comment will not update the UI yet, this is because we have not created a component to `list` the comment, but the form should create a `post` request with the correct `postId` and create a comment. 

- You can see that the `create comment form` component renders correctly. 

![image](https://user-images.githubusercontent.com/8760590/90331651-6f507b80-df73-11ea-8c19-ea19f2e6c03d.png)


- If you were to write a comment in any one of the tiles, there should be a console log, depicting the `{postId}` of the `post` parent object. 

![image](https://user-images.githubusercontent.com/8760590/90331687-b3438080-df73-11ea-8951-f527d29d5aa2.png)

![image](https://user-images.githubusercontent.com/8760590/90331696-c2c2c980-df73-11ea-89ca-f9c466edbf81.png)

- If we copy the `postId` from the console.log, and execute a GET request on comments in Postman, which requires a `postId` as a parameter (http://localhost:4001/posts/:id/comments) we can see the post to the comments service. 

![image](https://user-images.githubusercontent.com/8760590/90331736-159c8100-df74-11ea-8bf5-4afe2c0c2d12.png)

---

## Section 2: Lecture 21 - Display Comments
#### Procedures

1. First we need to create the `CommentList` component source file, so nav to `/client/src/` and make a file called `CommentList`. 

```javascript 
pwd 
// /Users/gabrielrodriguez/Desktop/node_microservices/blog/client/src

code CommentList.js
```

2. Much of this code is the same that you will see in the `PostList` service that was created in `Lecture 19 - Fetching & Rendering Posts` so I will not itemize all the steps here simply indicate any relevant changes. The primary dependency here is that the `GET comments` endpoint requires an id from `PostsList`. So the crux of the `CommentList` service is to ensure we can get the `postId` from the `PostList` component. Let's start by simply creating the boiler plate code along with some import references. 

```javascript
import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 

export default() => {

    return (
        <div/>
    )
}
```

3. We want to assume that this component will receive a `postId`, so we can updated the `default()` method with the `postId` coming from `PostList`. 

```javascript
import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 

export default({postId}) => {

    return (
        <div/>
    )
}
```

4. With the `postId` we now have all we need to fetch `comments`, set state, handle event listeners, and render the `commentList` back to the UI. Lets start by assigning state and making an axios call. 

```javascript
import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 

export default({postId}) => {

    const [comments, setComments] = useState([]); 

    const getComments = async () => {
        const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`, {comments})
        setComments(res.data);
    }

    return (
        <div/>
    )
}
```
> NOTE: When we assigned state with the `PostList` component, we initialized `useState({})` with an Object. That is because the data structured we created to store comments, was an Object. With `comments` our GET call will return an array of comments, so we need to change the initial state of `useState([])` to an array instead.

5. Now we only want to call our `getComments` function on window load, so we will use the `useEffect` hook. 

```javascript
import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 

export default({postId}) => {

    const [comments, setComments] = useState({}); 

    const getComments = async () => {
        const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`, {comments})
        setComments(res.data);

        useEffect(()=>{
            getComments();
        }, [])
    }

    return (
        <div/>
    )
}
```

6. The last thing we have to do is `map` over our list of comments and return some `JSX` rendering back to the UI in the Post card. 

```javascript
import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 

export default({postId}) => {

    const [comments, setComments] = useState({}); 

    const getComments = async () => {
        const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`, {comments})
        setComments(res.data);

        useEffect(()=>{
            getComments();
        }, [])
    }

    const renderComments = comments.map((comment)=>{
        return <li key={comment.id}>
            {comment.content}
        </li>
    })

    return <ul>
        {renderComments}
    </ul>
}
```

> NOTE: In the video, in `useEffects` hook, there is an empty array passed as an argument. I removed this array because both the Console display & Google Chrome Console were displaying a warning which resolved when I removed the empty array. 

On the terminal window
![image](https://user-images.githubusercontent.com/8760590/90332742-cf97eb00-df7c-11ea-98bd-d7bf7352d283.png)

In Google Chrome Developer Tools 
![image](https://user-images.githubusercontent.com/8760590/90332752-eb02f600-df7c-11ea-8eb3-bfafd398d58c.png)

Console display when I remove the array 
![image](https://user-images.githubusercontent.com/8760590/90332770-1dacee80-df7d-11ea-83e1-221f02dae926.png)

Error is also gone from Google Chrome Developer Console.

> NOTE: Even though you can make the error go away **DO NOT REMOVE THE ARRAY PARAM** in the `useEffect()` method. **IF YOU DO REMOVE** you will get a continual loop of calls to the `comments` service attempting to repopulate the `CommentList` component. 

See example ... with the `useEffect(()=>{...})` <- **NO ARRAY**, you will have 8K calls in ~15 seconds 

![image](https://user-images.githubusercontent.com/8760590/90333557-2b19a700-df84-11ea-9d85-a764c26ef3ca.png)

Versus with the array as a param `useEffect()=>{...},[]` **WITH ARRAY**, you only get 3 calls, because there are 3 posts

![image](https://user-images.githubusercontent.com/8760590/90333588-6320ea00-df84-11ea-99fa-fb5ccb820a41.png)

7. We will now go over to our `PostList` component where we will add out `CommentList` to the card. Make sure to import the `CommentList` component. Add the `CommentList` element, and ensure that you pass `postId` with data binding. 

```javascript 
import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 
import CommentCreate from './CommentCreate';
import CommentList from './CommentList'; 

export default() => {

    const [posts, setPosts] = useState({}); 

    const getPosts = async () => {
        const res = await axios.get('http://localhost:4000/posts')
        setPosts (res.data); 
    }

    useEffect(()=>{
        getPosts(); 
    }, [])

    const renderedPosts = Object.values(posts).map(post => {
        return <div className="card" style={{ width: '30%', marginBottom:'20px' }} key={post.id}>
            <div className="card-body">
                <h3>{post.title}</h3>
                <CommentList postId={post.id}/> 
                <CommentCreate postId={post.id}/>
            </div>
        </div>
    })

    return (
        <div className="row d-row flex-row flex-wrap justify-content-between">
            {renderedPosts}
        </div>
    )
}
```

8. If you now execute a test on the front-end you should see comments load within the `posts` card as intended. The new comment form will accept input and render a new comment, but you will have to refresh page, because we did not write any reload logic into the page rendering to display the comment automatically. 

![image](https://user-images.githubusercontent.com/8760590/90332848-af1c6080-df7d-11ea-8981-cdfb5e931e56.png)


---

## Section 2: Lecture 22 - Completed React App
#### Comments

- [ ] There was nothing in this lesson other than the source code files zipped up in the event that you did not complete Lectures 10 - 21. Saved the files in the ticket and closed the ticket. 

---     

## Section 2: Lecture 23 - Request Minimization Strategies
#### Notes

The application is working but there are some inefficiencies that need to be addressed. 

The first inefficiency is that every time we make a post we are getting unnecessary calls to our back-end that are duplicative. 

For example, for each post an individual comment call is being made for `n` number of posts. This should all be handled together, as opposed to potentially absorbing multiple api calls on a throttled capacity. 

See the Google Chrome Console, for an example. We have 3 posts and for each post we are making 3 calls to our `comments` service to retrieve comments. This is inefficient and if there are throttling limits on the `comments` service we just unnecessarily burned 2 additional requests when one would have sufficed. 

![image](https://user-images.githubusercontent.com/8760590/90333681-1be72900-df85-11ea-83bf-4a895ed31f53.png)

Effectively we are doing this ... 
1. For every GET `posts`, we are returning an array of `post` objects
2. For each object in the array we are then making a GET call to the `comments` API 
3. Assume we only had 10K calls per day allotted to us per an SLA, we would quickly burn through our call quantity to the `comments` service if our `posts` grew to scale with this type of design. 

![image](https://user-images.githubusercontent.com/8760590/90333742-68caff80-df85-11ea-8c10-6b0d019548ac.png)

A better design would be to condense all our posts to one request to retrieve the associated comments. 

So how would we do that? 

In a `Monolith` architecture this would be very easy to solve. The architecture would look something like this...

![image](https://user-images.githubusercontent.com/8760590/90333820-2a821000-df86-11ea-8ee3-a09b2a4a0659.png)

Here we would share the data storage mechanism for both `posts` & `comments` and we could easily have a single processing engine (or distributed) make a call to the back-end, execute a query of both `comments` & `posts` and return a single response with all data. 

But in a `Microservice` architecture, this isn't so straight forward. 

![image](https://user-images.githubusercontent.com/8760590/90333843-57cebe00-df86-11ea-9b92-912091eabfe7.png)

If you refer back to the design principles in Microservices; We don't have the ability to `gather all` data for both services, because each service has its own data store, and the comments need to be associated with a `postId` to retrieve comments that are relevant to the post. 

So we are back to evaluating our 2 communication mechanisms: 
1. Synchronous 
2. Asynchronous 

#### A `Synchronous` Approach may look something like this: 

![image](https://user-images.githubusercontent.com/8760590/90333901-db88aa80-df86-11ea-9999-7d330d8b4396.png)

1. Here we have a request from the client to the backend `posts` service. 
2. The `post` service would pass all the associated `postIds` and query the backend of the `comments` service retrieving the associated `comments`
3. With the query complete, the `posts` service would then submit back to the client all `post` and associated `comments` in a single request. 

Recall the pros/cons of this approach: 
![image](https://user-images.githubusercontent.com/8760590/90333920-0a068580-df87-11ea-8cee-2f02b022030b.png)

---

## Section 2: Lecture 24 - An `Async` Solution
#### Notes

To compare, see Lecture 23 - A `Sync` Solution for comparison purposes. 

An `async` solution architecture would look like this... 

![image](https://user-images.githubusercontent.com/8760590/90334278-bba6b600-df89-11ea-9af2-7a0b7ff86dd5.png)

In this design would would have the following components: 
1. Our existing `posts` service
2. Our existing `comments` service
3. We would add a `Query` service that would execute the mappings between the `posts` & `comments`
4. We would add an `event` bus that would manage the listening & handling of `event` objects that were emitted by our services. 

The implementation would work something like this ... 

![image](https://user-images.githubusercontent.com/8760590/90334254-91ed8f00-df89-11ea-91f5-fe1019b7b09e.png)

1. Our `post` service would emit an `event`. 
2. The `event` Object would have a schema defined with needed attributes
3. The `event bus` would be listening for the emitted event
4. The `event bus` based on the event would have some understanding of where the event now had to go
5. In this case our `event bus` would route the `event` to the `query service`

![image](https://user-images.githubusercontent.com/8760590/90334342-44255680-df8a-11ea-91d0-86c1200f9bff.png)

6. With the event received from the `bus` the `query` service would log attributes of the event payload in a collection or data structure of some kind for further processing as needed. 

![image](https://user-images.githubusercontent.com/8760590/90334372-73d45e80-df8a-11ea-9cf1-551e77139f0a.png)

7. Over time, a `comment` will get created for that `post`. When it does, another `event` will be generated this time from the `comments` service. Once again, the `event` payload generated by the `comments` service will have a particular schema where that data will be passed to the event bus. This `event` will once again get passed to the `query` service. 

![image](https://user-images.githubusercontent.com/8760590/90334431-c6157f80-df8a-11ea-80f5-5638e75951af.png)

8. Because this is a different type of event with different schema, the data from this event will populate previously `unknown` attributes of data, but associate them with the data that was already there, like the `postId` generated from the `post` event in Step 6. 

![image](https://user-images.githubusercontent.com/8760590/90334483-27d5e980-df8b-11ea-9521-995845569ac2.png)

9. Now with with `query` service containing both the `post` and `comment` data in its own data store without being a dependency to the `post` or `comment` service, any client application needing both `posts` and `comments` can simply query the `query` service with a CRUD call and retrieve the requested information to populate the front end client app. 

![image](https://user-images.githubusercontent.com/8760590/90334530-84390900-df8b-11ea-9499-324325361e75.png)

##### Pros/Cons

![image](https://user-images.githubusercontent.com/8760590/90334539-92872500-df8b-11ea-8457-bf8f12d30545.png)

---

## Sect 2 - Lecture 26 - Event Bus Overview
#### Notes 

![image](https://user-images.githubusercontent.com/8760590/90334937-6de07c80-df8e-11ea-8c31-5296a653dddd.png)


The implementation we will build

![image](https://user-images.githubusercontent.com/8760590/90335012-f3642c80-df8e-11ea-824d-7bcc5f13289a.png)

1. Anytime a new `post` is created an event will get posted to our TBD - `Event Bus` service
2. That event bus will then echo that event payload out to all services (including the one that emitted the event)
3. The services that care about that event will process the event and make the subsequent data stores or business logic

--- 

## Section 2: Lecture 27 - A Basic Event Bus Implementation
#### Procedures

1. To start nav to the root dir of the application `blog` and make a new dir called `event-bus`, and nav to `event-bus`. 

```javascript
pwd
///Users/gabrielrodriguez/Desktop/node_microservices/blog

mkdir event-bus && cd event-bus
```

2. Generate a new `package.json` file with `npm init`

```javascript 
npm init -y
```

3. Install dependencies 

```javascript
npm install express axios --save

npm install -g nodemon 
```

4. Create an `index.js` file within the `event-bus` directory

```javascript
code index.js
```

5. Implement boilerplate express app code 

```javascript 
const express = require('express'); 
const bodyParser = require('body-parser'); 
const app = express(); 

const PORT = 4005 || process.env.PORT; 
app.use(bodyParser.json()); 

app.listen(PORT, ()=>{
    console.log(`Event-Bus Service is up and listening on port ${PORT}`)
})
```

6. Modify `package.json` for start script 

```javascript 
{
  "name": "event-bus",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.19.2",
    "express": "^4.17.1"
  }
}
```

7. Start the server to see that it boots up... 

```javascript 
npm start
```

8. Implement `event-bus` design. Recall we are simply processing the emitted event and sending post requests to all services (`posts`, `comments`, & our tbd `query service`) 

```javascript 
const express = require('express'); 
const bodyParser = require('body-parser'); 
const axios = require('axios');
const app = express(); 

const PORT = 4005 || process.env.PORT; 
app.use(bodyParser.json()); 

app.post('/events', (req, res)=>{
    const event = req.body; 
    axios.post('http://localhost:4000/events',event);   //posts service
    axios.post('http://localhost:4001/events',event);   //comments service
    axios.post('http://localhost:4002/events',event);   //query service (TBD)
    res.send( {eventStatus: "OK"} );
});

app.listen(PORT, ()=>{
    console.log(`Event-Bus Service is up and listening on port ${PORT}`)
})
```

> NOTE: The code above all assumes that the POST request will succeed. There is no handling at the moment if any or all of the POST requests to the various services fails. This will be something that needs to be managed and will be addressed in later discussions. 

---

## Section 2: Lecture 28 - Emitting Events
#### Procedures

1. Now that we have an `event-bus` that is emitting events to a `http://localhost:{port}/events` endpoint for all our various services we need to implement this route on our `posts`, `comments`, and TBD `query` services. Lets begin with `posts`. Nav to the `/blog/posts/index.js` file and add the axios package as well as add the `/events` route. 

```javascript
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
```
2. If you restart all the services and go back to the front end you'll see that there are no `posts`. If you submit a new post and refresh you will see you post appear on the front-end as planned. If you go to the terminal of the `event-bus` service you will see errors. This is because even thought you are now able to emit events to the `event-bus`, the `event-bus` is attempting to echo the `event` back out and the `posts` service **DOES NOT** have a `/events` endpoint within its route structure for the `event-bus` to send a successful `POST` too. We will correct this in the next lecture. For now if you are receiving `400` errors then that is the intended outcome. 

![image](https://user-images.githubusercontent.com/8760590/90336282-0fb89700-df98-11ea-9d16-b8c5b9da3248.png)

---

## Section 2: Lecture 29 - Emitting Events Comment Creation
#### Procedures

1. Just like with the `posts` service we needed to emit an event to the `event-bus` so also, we need to emit an event when a `comment` is created. This event payload will be different than the `posts` payload, but the overall architecture and purpose is the same. Start by nav-ing to the `comments` serivce at `/blog/comment` and opening the `index.js` file. 

2. In the `/blog/comments/index.js` file require `axios` and modify the `POST /posts/:id/comments` route to include logic that will emit an event to the `event-bus`. 

```javascript 
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
    await axios.post('http:localhost:4005/events', {
        type: 'CommentCreated', 
        data: {
            id: commentId, 
            content, 
            postId: req.params.id
        }
    });
    res.status(201).send(comments); 
});

app.listen(PORT, ()=>{
    console.log(`Comments Service is up and listening on port ${PORT}`)
})
```

3. Now if you go to the front-end application, you should be able to create a `Post`, and for the post, you can also create a `Comment`. 

![image](https://user-images.githubusercontent.com/8760590/90336775-447a1d80-df9b-11ea-8950-bc0c72c05ff4.png)

> NOTE: Once again on your terminal for both the `event-bus` and the `comments` service you are going to get errors because we have not implemented a route on the `comments` serivce to handle the post request coming from the `event-bus` to the `POST http://localhost:{port}/events` endpoint we specified in the `event-bus` service. 

Error on the `comments` service
![image](https://user-images.githubusercontent.com/8760590/90336821-9ae75c00-df9b-11ea-874c-73bf42280a6c.png)


Error on the `event-bus` service 
![image](https://user-images.githubusercontent.com/8760590/90336836-adfa2c00-df9b-11ea-906e-ac7db417de63.png)

---