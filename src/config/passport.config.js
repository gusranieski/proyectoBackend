import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { options } from "./config.js";
import { CustomError } from "../services/customError.js";
import { EError } from "../enums/EError.js";
import { generateUserErrorInfo } from "../services/userErrorInfo.js";
import cartModel from "../dao/models/cart.model.js";

const adminUser = options.auth.account
const adminPass = options.auth.pass

const initializedPassport = () => {
    //Estrategia de regristro de usuario
    passport.use("register", new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                const {first_name, last_name, age}= req.body
                if(!first_name || !last_name || !age) {
                    CustomError.createError({
                        name: "User create error",
                        cause:generateUserErrorInfo(req.body),
                        message: "Error creando el usuario",
                        errorCode: EError.INVALID_JSON,
                    });
                };

                const cart = new cartModel(); // Crea un nuevo carrito
                await cart.save();

                const user = await userModel.findOne({ email: username });
                if (user) {
                    req.logger.error("usuario ya registrado");
                    return done(null, false);
                }
                let role = "usuario";
                if (username === adminUser && password === adminPass) {
                    role = "admin";
                }
                // si no existe el usuario se crea
                const newUser = {
                    first_name,
                    last_name,
                    full_name: `${first_name} ${last_name}`,
                    age,
                    email: username,
                    password: createHash(password),
                    cart: cart._id, // Asigna el ID del carrito al usuario
                    role: role,
                    avatar: req.file ? req.file.filename : null,
                };
                const newUserCreated = await userModel.create(newUser);
                req.logger.info("se registró un nuevo usuario");
                return done(null, newUserCreated); 
            } catch (error) {
                req.logger.error("registro inválido");
                return done(error);
            }
        }
    ));

//Estrategia de logueo de usuario
    passport.use("login", new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                if (!user) {
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false);
                }

                // modificar última conexión del usuario
                user.last_connection = new Date();
                const userUpdated = await userModel.findByIdAndUpdate(user._id, user);
                return done(null, userUpdated);
            } catch (error) {
                return done(error);
            }
        }
    ));

passport.use("githubSignup", new GithubStrategy(
    {
        clientID: options.github.clientID,
        clientSecret: options.github.clientSecret,
        callbackURL: options.github.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { displayName, emails } = profile;

        const cart = new cartModel(); 
        await cart.save();
    
        const userExists = await userModel.findOne({ email: profile.emails[0].value });
        if (userExists) {
          return done(null, userExists);
        }

        let role = "usuario";
        if (profile.email === adminUser && password === adminPass) {
            role = "admin";
        }
    
        const newUser = {
          first_name: displayName,
          last_name: displayName, 
          full_name: displayName,
          age: null, 
          email: emails[0].value,
          password: createHash(profile.id),
          cart: cart._id,
          role: role,
        };

        const newUserCreated = await userModel.create(newUser);
        return done(null, newUserCreated);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            return done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export { initializedPassport };
