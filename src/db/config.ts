import { ConnectionOptions } from 'mongoose';

const {
  MONGO_USER_NAME,
  MONGO_USER_PASSWORD,
  MONGO_HOST,
  MONGO_DB_NAME,
} = process.env;

const credentials = `${MONGO_USER_NAME}:${encodeURIComponent(
  MONGO_USER_PASSWORD,
)}`;
const address = `${encodeURIComponent(MONGO_HOST)}`;
const params = 'retryWrites=true&w=majority';

export const MONGO_URI = `mongodb+srv://${credentials}@${address}/${MONGO_DB_NAME}?${params}`;

console.log(MONGO_URI);

export const MONGO_OPTIONS: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
