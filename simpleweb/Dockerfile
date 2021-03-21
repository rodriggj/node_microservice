# Specify a base image
FROM node:alpine

# As of Node version 15 you need to install a WORKDIR command
WORKDIR /usr/app

# Install some dependencies
COPY ./ ./
RUN npm install

# Defaul Command
CMD ["npm", "start"]