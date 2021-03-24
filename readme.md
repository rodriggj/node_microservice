# Section 7

## Predecessor Steps
1. Complete Section 6

## Steps
1. In root project directory create a .yml file for the Travis configuration 

```
code .travis.yml
```

> __NOTE:__ Make sure you include the preceeding `.` in front of the yaml file.

2. Configure the travis .yml file by entering the following code:

```yaml
sudo: required
language: generic
services: 
  - docker

before_install:
  - docker build -t rodriggj/frontend:1.5 -f Dockerfile.dev .

script: 
  - docker run -e CI=true rodriggj/frontend:1.5 npm run test
```

