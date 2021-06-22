# mdcl-service-demo


## Setup DEV environment
### Pre requirements
- #### Nodejs install
    - Install nodejs 14.15 or higher [Download Nodejs](https://nodejs.org/en/download/)
- #### Nodemon install
    - Install yarn `npm install --global nodemon`
    - Read more: [Nodemon](https://nodemon.io/)
    
- #### Yarn install
    - Install yarn `npm install --global yarn`
    - Read more: [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

### First time setup:
1. From project root run `yarn`, this will install all packages for the solution.
2. Run `yarn` in the next directories: **/demo_client**, this will install specific node modules packages for non-project apps.
3. From project root run `yarn test` to verify all components are pass tests.

### Run dev environment:
1. Inside service run `yarn run start-dev` to run service.
2. Inside demo_client `yarn run start` to run react dev server