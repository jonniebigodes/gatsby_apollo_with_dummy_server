# What is this

Inside here is a simple implementation of a nodejs graphql server using a sqlite 3 database and [sequelize](https://sequelize.org/) to emulate how you would consume a full blown GraphQL api

## Folder Structure

- `config` folder is used by [sequelize](https://sequelize.org/) to host it's configuration
-  `migrations` folder is used when the the model is going to be created based on the information provided
- `models` this folder is self explanatory, inside it the model to be consumed is present
- `seeders` this folder is used when you need seed the database a priori. For brevity and simplicity purposes this was not used

## How to run this


Install the dependencies with your favourite package manager. I used `npm`, but if you run it with `yarn` it won't be a problem.

I left in some scripts to illustrate how you could use it. Should you need to change it on your own end, with a diferent database file or models.

- To use a different database file, delete the `database.sqlite` file, create your own, update `config\config.json` to match it and run the script:

```bash
npm run sequelize-init
```

- To create new models, you'll need create your own scripts like `create_tasks_model`. And once it's done don't forget to run `db_migrate` to run the database migration

- To start the server just need to run `npm start` or `yarn start` depending on your choice.