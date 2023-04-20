import passport from "passport";
import LocalStrategy from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const initializedPassport = () => {
    passport.use("register", new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                if (user) {
                    return done(null, false);
                }
                let rol = "usuario";
                if (username.endsWith("@coder.com")) {
                    rol = "admin";
                }
                // si no existe el usuario se crea
                const newUser = {
                    email: username,
                    password: createHash(password),
                    rol: rol
                };
                const newUserCreated = await userModel.create(newUser);
                return done(null, newUserCreated); 
            } catch (error) {
                return done(error);
            }
        }
    ));

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
                let rol = "usuario";
                if (username.password ===password) {
                    rol = "admin";
                }
                user.rol = rol;
                return done(null, user);
            } catch (error) {
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



// email = adminCoder@coder.com 
// password = adminCod3r123 
