import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const SECRET_SESSION = process.env.SECRET_SESSION;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_DB = process.env.MONGO_DB;

export const options = {
  server: {
    port: PORT,
    secretSession: SECRET_SESSION,
  },
  mongo: {
    url: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@coder-cluster-db.de6gzxv.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
  },
};
