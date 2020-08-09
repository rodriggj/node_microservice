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
