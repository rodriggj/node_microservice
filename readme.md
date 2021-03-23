# Section 6

## Predecessor Steps
1. Install Node.js & NPM. 

## Steps
1. Create React App

```javascript
npx create-react-app front-end
```

> __NOTE:__ CRA template for `create-react-app` no longer supports global install with npm. You need to 1. unistall prior `create-react-app` templates and use the following `npx` command to run `cra template`. The instructions can be found [here](https://create-react-app.dev/docs/getting-started#npx)


2. Familiarity with common commands that we will use to interact with the React application `front-end`

| Command         | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `npm run start` | Starts up a development server. For development use _only_   |  
| `npm run test`  | Runs tests associated with the project                       |   
| `npm run build` | Builds a __production__ version of the application           |  

3. Run the `npm run build` command, and you will see a new dir structure appear within the `front-end` root folder. 

4. As a child to the `front-end` folder create a `Dockerfile`, but specify a `.dev` extension to the file. This will ensure that it will only be applicable if not running in a prod environment. 

> __NOTE:__ We will create a `Dockerfile` for production as well and in that file, there will be __NO__ extension associated with the Dockerfile. In that `Dockerfile` we will configure the Dockerfile to run `npm run build` to create a production environment. 

```javascript
code Dockerfile.dev
```

5. Open the `Dockerfile.dev` and input the following to configure the container build that will host the React application `front-end`.

```javascript
# Specify the root image
FROM node:alpine

# Node requires a WORDIR
WORKDIR '/app'

# COPY package.json to establish build dependencies
COPY ./package.json ./

# Run the npm install command to configure dependecies
RUN npm install

# Copy all associated files in the directory structure to the container
COPY ./ ./

# Run the initial start up command
CMD ["npm", "run", "start"]
```

6. Now we can run the Docker file. Recall that 1. we will first need to `build` the image. & 2. then `run` the image. Recall also that when we executed the build commmand, we would 1. navigate to the root directory where the Dockerfile was and we would execute the following command: 

```
docker build .
```

> __NOTE:__ Docker would look for the Dockerfile, and execute the build against this configuration. But now, we don't have a `Dockerfile`, we have a `Dockerfile.dev`, and if you run the `docker build .` command, Docker renders an error. This is b/c Docker is looking for a file called `Dockerfile`. To overcome this error we need to speciy a different command using the file flag like so.

```
docker build -f Dockerfile.dev .
```

7. When the build completes you will see that you have `duplicate dependencies`. If you look in you current dir structure, you will see that when you used `npx create-react-app` the `cra-template` created a folder called `node_modules` for you, which is where the dependenices for the react app are installed. But recall also in the `Dockerfile.dev` you also specified a `npm install` command which reads the `package.json` files and installs all the `node_modules` in the container. Then you copy the content of the local file structure to the container creating duplicate copies of the `node_modules` files. This is an example of 1. inflating your container with unnneeded files, & 2. installing duplicate dependencies. You `do not` need to do this. Delete the `node_modules` file in your local directory, and re-build the contianer image. 

8. Now build the container image

```
docker build -f Dockerfile.dev -t rodriggj/frontend:1.3
```

9. Upon completion of a successful build of the container image, push the build to the docker hub

```
docker push rodriggj/frontend:1.3
```

10. Run the container image ensuring to supply a port forwarding configuration

```
docker run -p 3000:3000 rodriggj/frontend:1.3
```

11. SSH into the running container to see dir structure by opening another terminal window and executing the exec command

```
docker ps //copy the container image id
docker exec -it {container_image_id} sh
```

12. In order to prevent things like constantly having to rebuild and re-run an image, Docker allows you to use `volumes` to map directories from your local file snapshot to the container image. To set up a snapshot the syntax is as follows: 

```
docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app <image_id>
```

> __NOTE:__ The second tag `-v $(pwd):/app` is working just like our port mapping syntax. You are using the `-v` flag to specify a that you want the present working directory file path `$(pwd)` on your local, to be mapped `:` to the working directory you specified in the Dockerfile which in this case is `/app` in the container. This will mean that when a file within your `pwd` path gets changed, the container is simply mapped (aka binded) to that local directory. 

> __NOTE:__ The first tag is there because if you recall in the duplicate dependencies discussion, we deleted the `node_modules` folder that was created on our local when we ran `npx create-react-app front-end`. But we do need this folder b/c the contianer volume is trying to refernence a `node_modules` folder that is no longer there (b/c we deleted it). To do this we can once again use the `-v` tag, and instead of using a colon which indicates mapping of 2 folders, here we want the volume simply to contain a folder (not mapped) ... so we omit a `:` and simply specify the file path we want in the container `-v /app/node_modules`. 

13. Recall that we don't like to execute commands at the CLI. These should be automated to make `docker run` a consistent execution each time. Not to mention the CLI command is getting kind of long. To fix this we are going to once again use `docker-compose`. To do this we need a `docker-compose.yml` file. Lets create one and populate it with our automation. Make sure you are in the `frontend` dir and run ... 

```
code docker-compose.yml
```

14. Within the `docker-compose.yml` file write the following: 

```
version: '3.9'
services:
  web:
    build: 
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
```

15. With the `docker-compose.yml` file completed, we can now use `docker-compose` to run our commands that formerly need to be completed at the CLI. Now we can run all these commands by simply calling the following...


```
docker-compose up
```

> __NOTE:__ You can validate that the volumes are mapped correctly by making a change to the `src/App.js` file and checking that the running app on `localhost:3000` is updating. 

> __NOTE:__ You could be asking if we mapped the volumes do we still need to have teh `COPY ./ ./` statement in the `Dockerfile.dev` manifest. The answer is it is optional, but the recommendation is to leave it as it is a small impact to performance and if you decide to stop using `docker-compose` at some point the Dockerfile still will execute a `COPY` command.

16. Lets execute the `npm run test` command on our container by executing an override command on the `docker run` command.

```
docker run rodriggj/frontend:1.3 npm run test
or 
docker run -it rodriggj/frontend:1.3 npm run test
```
> __NOTE:__ When we override the docker run command and execute our test you can see that the `Tests` ran are 1. You can validate this by going to `src/App.test.js` file in our dir structure and you can see that there is 1 test. But what if we want to add tests to our container?

```javascript
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

17. To add additional tests to a running container we can do the following: 1. add a second test to `src/App.test.js` 2. run the container 3. open a second terminal and run the following: 

```javascript
// in src/App.test.js copy the test and paste a second test
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

```javascript
// run the container
docker-compose up
```

```javascript
// open a second terminal session and enter
docker ps   //run this command to get the image_id of the running container
docker exec -it <image_id> npm run test   //you should see 2 tests ran
```

18. There is a another way to execute this process, which is to build an additional service in our `docker-compose.yml` file. Modify the file by adding the following: 


```yaml
version: '3.9'
services:
  web:
    build: 
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
  tests:
    build: 
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    command: ["npm", "run", "tests"]
```

> __NOTE:__ Realize that the `npm run start` to build the `web` service to deploy our React app is a different than a service that would initiate a `npm run test`. Now when we run `docker-compose up` we will be instantiating a container used for the `web` service and another container used for the `tests` service.

```javascript 
docker-compose up --build
```

> __RESULTS:__ Here you see that the `service` config in the .yml file will render a similar result to the `docker exec` approach. Both approaches have pros/cons as to how to effect the test suite. Pick one and move on. 


> __REFERENCE:__
<p align="center">
    <image src="https://user-images.githubusercontent.com/8760590/112223223-3d7d5280-8bef-11eb-95c2-e7400c6630a1.png" width="450">
</p>

```javascript
// assume you have a running container
docker ps    // to identify the container id
docker attach <image_id> 
docker exec -it <image_id> sh
```

> __RECALL:__ With `docker attach` command, will _attach_ your termial session to the primary process of the container. Each primary process will have a _stdin_, _stdout_, _stderr_ process that will allow the terminal to provide input directly to the container. __UNFORTUNATELY__ docker-compose will is not configured to support docker attach. 

19. Now that we've seen how to get `npm run start` which is our dev environment, and `npm run test` which are our test cases, we now need to configure our container to something like this. Where we will use a production server to serve our `index.html` file, and `main.js` files to the web browser from the container. 

<p align="center">
    <image src="https://user-images.githubusercontent.com/8760590/112224064-67834480-8bf0-11eb-863a-0a33fbe2d022.png" width="450">
</p>

To do this we need to create a new `Dockerfile`. Recall that our `Dockerfile.dev` only initiated a `non-production webserver`, but for our production env we need a beefier server to handle production `req/res` cycles for our web application. 

To accomplish this task we will follow a flow similar to the one below: 
<p align="center">
    <image src="https://user-images.githubusercontent.com/8760590/112224647-2c354580-8bf1-11eb-9bcd-5d95b04361ca.png" width="450">
</p>

But we will immediately run into 2 issues that we need to resolve: 

<p align="center">
    <image src="https://user-images.githubusercontent.com/8760590/112224754-5edf3e00-8bf1-11eb-96b6-754583b0ef7e.png" width="450px">
</p>

1. We already created the needed dependencies when we ran `npm run build` and they are all captured in the `build` directory. We don't want to create another series of dependencies in our container and create our `duplicate resources` problem we had before. 

2. Where is the `nginx` image coming from? 

20. We are going to build a `Multi-Step Docker Build` to support the fact that we want to keep the `node:alpine` container image while in `non-prod` but when deploying to prod have a `nginx` image. So we want a process that looks similar to this: 

<p align="center">
    <image src="https://user-images.githubusercontent.com/8760590/112226117-61429780-8bf3-11eb-9388-34d8e612f111.png" width="450px">
</p>

21. To build our `multi-step` container we are going to create a `Dockerfile` which will execute the production build phase, and inherit the `build` directory files that were built in our build phase. 

```javascript
code Dockerfile
```

```javascript
FROM node:alpine
WORKDIR '/app'
COPY ./package.json .
RUN npm install
COPY ./ ./
RUN npm run build

FROM nginx
COPY --from=0 /app/build /usr/share/nginx/html
```

> __NOTE:__ The 2 blocks of code, each block corresponding to a build phase. The first phase or `phase 0` is built first with an image of `node:alpine`. The second block is built using the build files created in phase 0, but this time is deploying to a production grade server image `nginx`. 

22. Now we need to execute our build and run processes 

```
docker build . 
```

```
docker run -p 8080:80 rodriggj/frontend:1.4 
```

23. Now nav to a browser and execute a request to `localhost:8080`, and you should see the react application. 