import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const initializedPassport = () => {
//Estrategia de regristro de usuario
    passport.use("register", new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                const {first_name, last_name,age}= req.body
                const user = await userModel.findOne({ email: username });
                if (user) {
                    return done(null, false);
                }
                let role = "usuario";
                if (username.endsWith("@coder.com")) {
                    role = "admin";
                }
                // si no existe el usuario se crea
                const newUser = {
                    first_name,
                    last_name,
                    age,
                    email: username,
                    password: createHash(password),
                    role: role
                };
                const newUserCreated = await userModel.create(newUser);
                return done(null, newUserCreated); 
            } catch (error) {
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
                if (username.password ===password) {
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
            clientID: "Iv1.6b20084cfd0ef34e",
            clientSecret: "b28406e0c29d430c0b18eccf5ef2c1fd1195f1d1",
            callbackURL: "http://localhost:8080/api/sessions/github-callback"
        },
        async(accessToken, refreshToken, profile, done)=>{
            try {
                console.log("profile", profile)
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
    ))

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
