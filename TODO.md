## TODO List
* ExpressJS `express --view=pug myapp`
* * REST API
* * Middlewares
* Babel `--exec babel-node --presets @babel/preset-env`
* * ES6 `@babel/cli @babel/core @babel/node @babel/preset/env`
* Confing
* * Dotenv
* Sequelize `sequelize` - `sequelize-cli`
* * Migration `npx sequelize-cli model:generate --name Sample --attributes firstName:string,lastName:string,email:string`
* * Seed `npx sequelize-cli seed:generate --name Sample`
* * Setup `npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all`
* Authentication
* * PassportJS `passport`
* * JWT `passport-jwt jsonwebtoken`
* Swagger
* Scripts
* * Lint `eslint eslint-config-airbnb-base eslint-plugin-import`
* * Test
* * Pre-push