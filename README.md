# MDCL dev env

## Setup DEV environment
### Pre requirements
- #### Docker
  - Follow this steps to install: [Windows](https://docs.docker.com/docker-for-windows/install/), [Mac](https://docs.docker.com/docker-for-mac/install/)

- #### Nodejs install
  - Install nodejs 14.15 or higher [Download Nodejs](https://nodejs.org/en/download/)

- #### Yarn install
  - Install yarn `npm install --global yarn`
  - Read more: [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)


### First time setup:
  1. From project root run `yarn`, this will install all packages for the solution.
  3. From project root run `yarn test` to verify all components are pass tests.
  4. From project root, run (this will build and run static services):
     - `docker-compose up -d --build`

### Run dev environment:
  1. From project root, run: (if not running or changes has been made to Docker files)
      - `docker-compose up -d`
      -  This will run static services.
  2. Run `npm run start-dev` in the next directories: **/services/form**, this will start form service in watch mode (this services can be run in "debug" mode also)
  3. Open [http://localhost:8081](http://localhost:8081)