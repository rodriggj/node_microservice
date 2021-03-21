# Section 4: Making Real Projects with Docker

## Lesson 40
### Steps: 
1. Create a new dir called `simpleweb`
2. Nav to `simpleweb`
3. Run `npm init -y`
4. Install `express`
5. Configure `package.json` to run the `dev` and `start` script
6. Create an `index.js` file
7. Create a single route handler to `/` (root route). 


## Lesson 41. 
### Steps 
1. Within the `simpleweb` directory, create a new Dockerfile

```
code Dockerfile
```

2. Configure the Dockerfile

```Dockerfile
# Specify a base image
FROM alpine

# Install some dependencies
RUN npm install

# Defaul Command
CMD npm run dev
```

3. Build the image that is in the current directory

```Docker
docker build .
```



