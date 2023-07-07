import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { options } from "./config.js";
import { CustomError } from "../services/customError.js";
import { EError } from "../enums/EError.js";
import { generateUserErrorInfo } from "../services/userErrorInfo.js";

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
                    age,
                    email: username,
                    password: createHash(password),
                    cart: null,
                    role: role
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
                let role = "usuario";
                if (username.password === password) {
                    role = "admin";
                }
                user.role = role;
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

//Estrategia de autenticación con github
passport.use("githubSignup", new GithubStrategy(
    {
        clientID: options.github.clientID,
        clientSecret: options.github.clientSecret,
        callbackURL: options.github.callbackURL,
    },
    async(accessToken, refreshToken, profile, done)=>{
        try {
            const userExists = await userModel.findOne({email:profile.username});
            if(userExists) {
                return done(null, userExists)
            }
            const newUser = {
                email: profile.username,
                password: createHash(profile.id)
            };
            const newUserCreated = await userModel.create(newUser);
            return done(null, newUserCreated)
        } catch (error) {
            return done(error)
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
