# Kort

![Kort Icon](https://raw.githubusercontent.com/carlsonp/kort/master/public/images/logo-64.png)

[![Build and Test](https://github.com/carlsonp/kort/workflows/Build%20and%20Test/badge.svg?branch=master)](https://github.com/carlsonp/kort/actions)
[![Releases](https://img.shields.io/github/release/carlsonp/kort.svg)](https://github.com/carlsonp/kort/releases/latest)
[![All Downloads](https://img.shields.io/github/downloads/carlsonp/kort/total.svg)](http://www.somsubhra.com/github-release-stats/?username=carlsonp&repository=kort)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Known Vulnerabilities](https://snyk.io/test/github/carlsonp/kort/badge.svg)](https://snyk.io/test/github/carlsonp/kort)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/carlsonp/kort.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/carlsonp/kort/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/carlsonp/kort.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/carlsonp/kort/context:javascript)

## Table of Contents

[About](#About)  
[Screenshots](#Screenshots)  
[Installation and Setup](#Installation)  
[After Install](#AfterInstall)  
[Support / Improvement / Suggestions](#Support)  
[License](#License)

<a name="About"/>

## About

A web application supporting multiple user experience (UX) research methods.

* [Card Sorting](https://en.wikipedia.org/wiki/Card_sorting)
* [Tree Testing](https://en.wikipedia.org/wiki/Tree_testing)
* [Product Reaction Cards](https://en.wikipedia.org/wiki/Microsoft_Reaction_Card_Method_%28Desirability_Testing%29)
* [System Usability Scale (SUS)](https://en.wikipedia.org/wiki/System_usability_scale)
* [Net Promoter Score (NPS)](https://www.netpromoter.com/know/)

See the [website](https://carlsonp.github.io/kort/) for more information.

<a name="Screenshots"/>

## Screenshots

<img src="https://raw.githubusercontent.com/carlsonp/kort/master/docs/cs.png" width="250"/>
<img src="https://raw.githubusercontent.com/carlsonp/kort/master/docs/tt.png" width="250"/>
<img src="https://raw.githubusercontent.com/carlsonp/kort/master/docs/prc.png" width="250"/>
<img src="https://raw.githubusercontent.com/carlsonp/kort/master/docs/sus.png" width="250"/>
<img src="https://raw.githubusercontent.com/carlsonp/kort/master/docs/nps.png" width="250"/>

<a name="Installation"/>

## Installation and Setup

1. Use one of the following:

    1. Use [Git](https://git-scm.com/) to clone the code (`git clone https://github.com/carlsonp/kort.git`)
    2. [Download a release archive](https://github.com/carlsonp/kort/releases) from Github
    3. Install from the published [npm package](https://www.npmjs.com/package/@carlsonp/kort) via `npm install @carlsonp/kort`

2. Edit `app.js` and optionally set the `adminUser` and set your own username.

3. Edit the `adminPassword` value in `app.js`.

4. Optionally set `allowUserRegistration` in `app.js` to allow users to register.  Otherwise users can only be created by accounts with 'admin' access.

5. Optionally setup Google authentication.  [See the wiki for details](https://github.com/carlsonp/kort/wiki/Setting-up-Google-Authentication).

6. Continue installation [via source](#ViaSource) or
[via Docker](#ViaDocker).

<a name="ViaSource"/>

### Via Source

1. Install [Node.js](https://nodejs.org)

2. Install [MongoDB](https://www.mongodb.com/) (3.0 or higher) or provide a connection to an existing server
by editing the `app.js` file and setting the `mongoURL`.  Kort uses the Mongoose package. To optionally [secure your MongoDB with a username
and password](https://stackoverflow.com/questions/4881208/how-to-secure-mongodb-with-username-and-password/19768877),
create a user for the `kort` database by doing the following:

    Open a Mongo commandline shell:

    ```shell
    mongo --port 27017
    ```

    Select the database:

    ```mongo
    use kort
    ```

    Create the new user:

    ```mongo
    db.createUser(
       {
         user: "kort",
         pwd: "123",
        roles: [ { role: "readWrite", db: "kort" } ]
       }
    )
    ```

    Then edit `/etc/mongodb.conf` and enable `auth=true`.  Restart the service.  Make sure to set
    the `mongoURL` with the appropriate username and password.

3. Run `npm install` on the commandline.  This will install the dependencies into the `node_modules` folder.

4. Run `npm run build` on the commandline. This will setup browserify bundle, which is needed for browser 
imports of modules. You will see `bundle.js` in the `dist` folder.

5. Run `node app.js` from the main directory.  This will start the NodeJS server
on the default port 3000.

<a name="ViaDocker"/>

### Via Docker

1. [Install Docker](https://docs.docker.com/install/)

2. [Install docker-compose](https://docs.docker.com/compose/install/)

3. Ensure you create a `.env` file in the root of the project directory with the required environment variables (See `example.env`). If you choose to set the environment variables directly, remove any refences to the `.env` file in `docker-compose.yml` to prevent docker compose looking for it at build time.  

   If you wish to secure the connection between the `kort` and `mongo` containers,
   uncomment the `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`,
   `MONGO_INITDB_DATABASE`, `MONGO_KORT_USERNAME` and `MONGO_KORT_PASSWORD` values
   in the `.env` file and define the required credentials.

   If you need to specify connection options for the connection from  the `kort` to
   the `mongo` containers, uncomment the `MONGO_OPTIONS` value in the `.env` file
   and define the required connection options in url parameter format.

4. Build the containers

    ```shell
    docker-compose build
    ```

5. Start the containers (use -d to run in detached mode)

    ```shell
    docker-compose up
    ```

6. Stop the containers (when using detached mode)

    ```shell
    docker-compose down
    ```

Data from MongoDB is persisted and mounted as a Docker volume in the `./data/` folder.

<a name='AfterInstall'/>

### After Install

1. You can connect via [http://localhost:3000](http://localhost:3000)

2. The admin username and password for Kort can be set using environment variables `KORT_ADMIN_USER` and `KORT_ADMIN_PASSWORD`.
These can be set in the `.env` file or directly as environment variables.
**Please note that if you define these variables using both methods, the environment variables will take precedence.**
If the variables are not set, then a default usename and password of `admin`/`admin` will be used.

3. The `RATE_LIMIT` variable relates to the maximum number of requests that the server will allow over a 10 second period. By default the rate is set at 120. This can be edited in the `.env` file or as an environment variable. **Please note that if you define these variables using both methods, the environment variables will take precedence.**
**Please note this rate includes any requests the application makes to serve the ui pages such as css and js files, and can make over 20 requests per page.**

4. The `ENVIRONMENT` variable controls the Helmet settings. When the variable is set to `development`, we override certain security headers to facilitate load testing. In any other mode, it defaults to `production` and applies the strict security headers defined by Helmet.

<a name="Support"/>

## Support / Improvement / Suggestions

Open a [Github issue](https://github.com/carlsonp/kort/issues).

<a name="License"/>

## License

Kort is licensed under the [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).