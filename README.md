# Qrder Backend Server

Qrder is an online app for ordering in restaurants with high time efficiency and non-physical contacting.
Check product [documentation]() for more details.

## Installation

1. Fork this repo
2. Click on ``Code`` and copy the url
3. Run the following commands:

```bash
# Replace FORK_URL with what you just copied
git clone FORK_URL
cd backend
```

## 1. Install Docker and start it
* Setup docker: [click here](https://docs.docker.com/get-docker/)
* Start the docker app

## 2. Install app dependencies
```bash
yarn install
```
or
```bash
npm install
```

``yarn`` is the recomended package manager. Therefore, next instructions will be demonstrated via ``yarn``. You can install it with this [guide](https://yarnpkg.com/getting-started/install).

P.S. In order to be able to use Dockerfile properly, you must install the ``yarn``.

## 3. Setup the environment file
```bash
echo "JWT_SECRET='SECRET_KEY'" >> .env
```

## 4. Start the container
```bash
yarn container:start
```
Now, you should see the server ready message:
```bash
qrder_web | 🔷 NODE_ENV: development
qrder_web | 🚀 Server ready at http://localhost:5000
qrder_web | Executing (default): SELECT 1+1 AS result
qrder_web | 📚 Database connection has been established successfully
```

## 5. Setup database
In a separete terminal, run:
```bash
yarn container:setup
```
You should see:
```bash
>>> DB SETUP COMPLETE!
```
All set! Go to [http://localhost:5000/] -- you should see:
```js
{
  status: 1
}
```

## 6. Create a database model
```bash
yarn sequelize-cli model:generate --name Sample --attributes name:string,surname:string,email:string
yarn sequelize-cli seed:generate --name Sample
```

