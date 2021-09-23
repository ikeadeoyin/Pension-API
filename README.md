# Getting Started
- Clone the repo and open in a code editor

```
git clone https://github.com/ikeadeoyin/Pension-API.git

```
- Make sure you have Node.js installed by running

```
node --v

```

Otherwise, install Node.js from [here ](https://nodejs.org/en/)

Ensure you also have PostgreSQL installed.

- Create a file in config as `config.json` similar to` config/config.cjs`, substitue the DATABASE_NAME and DATABASE_PASSWORD

```
{
  "development": {
    "username":DATABASE_NAME ,
    "password": DATABASE_PASSWORD,
    "database": "abc_dev",
    "host": "127.0.0.1",
    "dialect": "postgres",
  },
  ...
}

```
- Run the following commands in a terminal
```
npm install
npx sequelize-cli db:migrate
nodemon app
```