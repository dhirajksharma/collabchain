## Package Manager and Commands

The project is setup using `yarn package manager version 1.22.19`

Here are the two commands we are using
- `yarn install` to install the dependencies post cloning
- `yarn dev` to run the server in development mode using nodemon
- `yarn start` to run the server in production mode using node

## Environment Variables

Below is the list of environment variables required (the list will be updated as and when needed, **please check the list before pulling new commits**):

- `PORT` to set which port the server will run
- `NODE_ENV` to detect whether the server is run in development mode or production (you do not need to alter it, it has been handled by the yarn commands mentioned above)
- `DB_URI` stores the URI for the local database
- `MONGO_URI` stores the URI for the production database
- `JWT_SECRET`
- `JWT_EXPIRE`
- `COOKIE_EXPIRE`
- `SMPT_SERVICE`
- `SMPT_MAIL`
- `SMPT_PASS`


> **Note:** Create the env file in the root directory with the name ".env". This is because of how the dotenv modules config method works. The default value for path is `path.resolve(process.cwd(), '.env')` If you are keeping your env file elsewhere or with a certain name, then you will need to pass the path to the method accordingly. However, I would recommend the former approach since hosting platforms (like Render and Vercel which I have used) will add the ".env" file to your root directory. So, doing a similar thing in your development will eliminate unnecessary conditionals in the code.