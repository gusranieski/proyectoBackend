import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import bcrypt from "bcrypt";
import { Faker, es, en } from "@faker-js/faker";
import multer from "multer";

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

// Multer Validation
const validFields = (body) => {
  const { first_name, last_name, email, age, password } = body;
  if (!first_name || !last_name || !age || !email || !password) {
    return false;
  } else {
    return true;
  }
};

const multerFilterProfile = (req, file, cb) => {
  const isValid = validFields(req.body);
  if (!isValid) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

// Multer Profile Storage Images
const profileStorage = multer.diskStorage({
  //donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/public/multer/users/images"));
  },
  //que nombre tendra el archivo que guardamos
  filename: function (req, file, cb) {
    cb(null, `${req.body.email}-profile-image-${file.originalname}`);
  },
});

export const uploaderProfile = multer({
  storage: profileStorage,
  fileFilter: multerFilterProfile,
});

// Multer Profile Storage Documents
const documentStorage = multer.diskStorage({
  //donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/public/multer/users/documents"));
  },
  //que nombre tendra el archivo que guardamos
  filename: function (req, file, cb) {
    cb(null, `${req.user.email}-document-${file.originalname}`);
  },
});

export const uploaderDocument = multer({ storage: documentStorage });

// Multer Storage Images Products
const productStorage = multer.diskStorage({
  //donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/public/multer/products/images"));
  },
  //que nombre tendra el archivo que guardamos
  filename: function (req, file, cb) {
    cb(null, `${req.body.code}-product-image-${file.originalname}`);
  },
});

export const uploaderProduct = multer({ storage: productStorage });
