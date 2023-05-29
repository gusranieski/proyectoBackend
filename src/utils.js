import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { Faker, es, en } from "@faker-js/faker";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword = (user, loginPassword) => {
  return bcrypt.compareSync(loginPassword, user.password);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// faker
export const customFaker = new Faker({
  locale: [en],
});

const { commerce, string, database } = customFaker;

export const createNewProduct = () => {
  return {
    _id: database.mongodbObjectId(),
    title: commerce.productName(),
    description: commerce.productDescription(),
    code: string.alphanumeric(4),
    price: parseFloat(commerce.price()),
    stock: parseInt(string.numeric(2)),
    category: commerce.productAdjective(),
    status: true,
  };
};
