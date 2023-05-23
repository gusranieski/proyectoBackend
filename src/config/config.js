import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const SECRET_SESSION = process.env.SECRET_SESSION;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_DB = process.env.MONGO_DB;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PERSISTENCE= process.env.PERSISTENCE

export const options = {
  server: {
    port: PORT,
    secretSession: SECRET_SESSION,
    persistence: PERSISTENCE
  },
  mongo: {
    url: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@coder-cluster-db.de6gzxv.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
  },
  github: {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL
  },
  auth: {
    account: ADMIN_EMAIL,
    pass: ADMIN_PASSWORD
  }
};
