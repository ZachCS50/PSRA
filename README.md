# Publicly Researched Observatory (PROBE)

This open source project seeks to design a system that allows a community to maintain publicly sourced research and analysis data on satellites.

## Table of Contents

1.  [Overview](#Overview)
2.  [How To Contribute](#How-To-Contribute)
3.  [Libraries](#Libraries)
4.  [License](#License)

## Overview

The main focus of this application is data entry experience, data validation, and api useability. In order to focus on those 3 core priorities, a MeteorJS framework was used to set-up and deploy the application. Meteor/WebApp and Meteor/Mongo were used in conjunction with ReactJS to provide a seamless stack that exposes a user-friendly frontend and api for the community to use. A custom combination of vanilla JS, Yup and Formik provide dynamic schema creation and data validation.

- Database: Meteor/MongoDB
- Client: ReactJS
- Server: Meteor/WebApp
- Repository: [GitHub](https://github.com/AFKrcher/PSRA)
- Staging Deployment: [PROBE](https://probe.saberastro.com)
- Production Deployment: **WIP**

## Usage

### Application

The application should be intuitive and easy-to-use, even for a first-time user. If something is not clear, tooltips, keys, and captions are sprinkled throughout the application instructing users on what things are and how they work. If you think the UI/UX is not user-friendly enough, please submit an issue and a suggestion on how we fix it!

### Public API

The public API allows all users to obtain information on satellites and schemas produced by PROBE. Queries can be made to obtain specific satellites or schemas. Below is a list of example requests:

GET: `/api/`

RESPONSE: `"Welcome to the PROBE public API! For documentation, please visit the README at https://github.com/justinthelaw/PROBE."`

GET: `/api/satellites`

RESPONSE: 
```
{
  "_id": "fTTviYiQRoMLdRC26",
  "isDeleted": false,
  "noradID": "25544",
  "createdOn": "2021-10-04T17:49:45.758Z",
  "createdBy": "admin",
  "modifiedOn": "2021-10-05T19:31:08.144Z",
  "modifiedBy": "admin",
  "adminCheck": true,
  "machineCheck": false,
  "names": [
    {
      "reference": "https://www.nasa.gov/mission_pages/station/main/index.html",
      "verified": [
        {
          "method": "user",
          "name": "admin",
          "verified": true,
          "verifiedOn": "2021-10-07T00:00:00.000Z"
        },
        {
          "method": "machine",
          "name": "Layer8",
          "verified": false,
          "verifiedOn": ""
        }
      ],
      "validated": [
        {
          "method": "user",
          "name": "admin",
          "validated": true,
          "validatedOn": "2021-10-07T00:00:00.000Z"
        },
        {
          "method": "machine",
          "name": "Layer8",
          "validated": false,
          "validatedOn": ""
        }
      ],
      "name": "International Space Station"
    }
  ],
  "descriptionShort": [
    {
      "reference": "https://en.wikipedia.org/wiki/International_Space_Station",
      "verified": [
        {
          "method": "user",
          "name": "admin",
          "verified": true,
          "verifiedOn": "2021-10-07T00:00:00.000Z"
        },
        {
          "method": "machine",
          "name": "Layer8",
          "verified": false,
          "verifiedOn": ""
        }
      ],
      "validated": [
        {
          "method": "user",
          "name": "admin",
          "validated": true,
          "validatedOn": "2021-10-07T00:00:00.000Z"
        },
        {
          "method": "machine",
          "name": "Layer8",
          "validated": false,
          "validatedOn": ""
        }
      ],
      "descriptionShort": "The International Space Station is a modular space station in low Earth orbit. It is a multinational collaborative project involving five participating space agencies: NASA, Roscosmos, JAXA, ESA, and CSA."
    }
  ]
  ...
}

```

### Partner API

The partner API allows registered partners with PROBE API keys to go beyond the public API GET requests. The partner API is used mainly for PATCH, POST, and DELETE requests, as well as GET requests of more detailed information. Below is a list of example requests:

GET: `/api/partner/:key`

RESPONSE: `"Welcome to the PROBE partner API! For documentation, please visit the README at https://github.com/justinthelaw/PROBE."`

## How To Contribute

### Github Processes

1. Fork and clone the repository using standard Git and Github commands
2. Ensure you have fetched and pulled the latest master/main branch of the repository
3. Set-up your feature branches to the following standard: `feature/<feature name>-<GitHub username>`
4. Ensure that any libraries or technologies that you use are properly listed in the dependency tree and in this README's [Libraries](#Libraries) section
5. Contribute to the main/master repository through clear and succinct pull requests
6. When not contributing code directly, generate issues on GitHub with context, problem statement, and, if possible, a suggested solution

### Installation

1. Ensure you have NodeJs installed: https://nodejs.org/en/download/
2. Install Meteor here: https://www.meteor.com/developers/install
3. Clone the repo `git clone https://github.com/AFKrcher/PSRA.git`
4. Inside the src folder run `meteor npm install`
5. Run `meteor`
6. Go to `http://localhost:3000` and you should see the test app running.

### Environment Variables

(Development + Production)

Environment variables that control the operation of the app are defined in the
`.env` file in the application root. These variables and their usage are shown
in the following table.

Environment variables maintained in the `.env` file are made available to the
application code via `process.env.<variable-name>`. Prior to development or deployments, the following environment variables must be defined in the `.env` file. A `.env.example` has been provided in the `~/src/private` as a template.

| Environment Variable | Description                               | Example Setting | Applicability |
| :------------------- | :---------------------------------------- | :-------------- | :------------ |
| ADMIN_PASSWORD       | Password for admin account in development | password        | server        |
| PROBE_API_KEY        | PROBE API access key                      | password        | server        |

### Access MongoDB

(Development Only)

1. Meteor must be running
2. In the command prompt run

```
meteor mongo
show collections
db.<collection name>.find()
```

### Docker Containerization

(Development + MongoDB and SMTPS access)

The Docker deployment is dependent on a `pm2.json` file to describe the configuration of your meteor application. A pm2.example.json is provided for filling-in. In addition, a `.env.example` is provided for environmental variable configration as described in the [Environment Variables](#Environment-Variables) section of this README.

Paste and run the following commands at the root of the project to build and run a docker image of PROBE on http://localhost:3000.

```
chmod 777 scripts/build.sh && scripts/build.sh
docker run --rm --name probe --env-file src/private/.env -p 3000:3000 -t probe
```

### AWS Deployment

(Production Only)

**Note**: Meteor only runs with NodeJS 14.17.1, so you need to install nvm and run `nvm install 14.17.1`

Login to the EC2 instance using ec2-user and run the following commands to build the latest project:

```
cd /app
sudo mkdir builds
sudo chown -R ec2-user:ec2-user builds
git clone https://github.com/AFKrcher/probe.git
cd /app/probe/src
meteor npm install
ulimit -H -a
meteor build /app/builds --verbose
sudo tar xzf src.tar.gz -C /var/www/html
cd /var/www/html
sudo mv bundle/* .
sudo rm -rf bundle
cd programs/server
sudo chmod -R 777 /var/html/www
npm install --production
export PORT=3000
export MONGO_URL='mongodb+srv://<username>:<password>@<your_mongo_db_url>'
export ROOT_URL=''
export MAIL_URL=''
node main.js
```

## Libraries

The following is a list of notable packages and technologies used to build this application. Those not listed are considered defaults for the Meteor or React frameworks.

### NPM

| Module/Library        | Environment | Description                          |
| :-------------------- | :---------- | :----------------------------------- |
| material-ui           | Development | Component library                    |
| formik                | Development | Form management library              |
| formik-material-ui    | Development | Formik + MUI compatability library   |
| react-swipeable-views | Development | Picture gallery component            |
| dotenv                | Development | Configuration .env reader            |
| meteor                | Runtime     | App adaptation library for Meteor    |
| react                 | Runtime     | Web-application framework            |
| react-dom             | Runtime     | DOM renderer for React               |
| yup                   | Runtime     | Object schema and validation library |
| use-debounce          | Runtime     | React debouncing hook                |
| helmet                | Runtime     | CSP and HTTP header security         |
| express               | Runtime     | HTTP utility methods                 |

### Meteor

| Module/Library    | Environment | Description                    |
| :---------------- | :---------- | :----------------------------- |
| mongo             | Runtime     | NoSQL database for Meteor      |
| accounts-base     | Runtime     | Account management for Meteor  |
| accounts-password | Runtime     | Password management for Meteor |
| alanning:roles    | Runtime     | Role management for Meteor     |

## License

This software is licensed under the [ISC](./LICENSE) license. For more terms, privacy policy, or questions, please contact the contributors directly.
