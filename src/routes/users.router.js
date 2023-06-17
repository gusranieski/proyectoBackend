import { Router, json } from "express";
import { 
    passportSignupController, 
    productsRedirectController, 
    passportFailSignup, 
    passportLoginController, 
    passportFailLogin, 
    signupGithubController, 
    signupGithubCallbackController, 
    logoutController, 
    currentUserController, 
    allUsersController, 
    mailUserController,
    smsUserController,
    premiumController 
} from "../controllers/users.controller.js";
import { checkRole } from "../middlewares/auth.js";

const usersRouter = Router();

usersRouter.use(json());

// ruta del registro
usersRouter.post("/signup", passportSignupController, productsRedirectController);
usersRouter.get("/failure-signup", passportFailSignup);

// ruta del login
usersRouter.post("/login", passportLoginController, productsRedirectController);
usersRouter.get("/failure-login", passportFailLogin);

// ruta de github
usersRouter.get("/github", signupGithubController);
usersRouter.get("/github-callback", signupGithubCallbackController, productsRedirectController);

// ruta del logout
usersRouter.post("/logout", logoutController);

// ruta current
usersRouter.get("/current", currentUserController);

// ruta todos los users
usersRouter.get("/", allUsersController);

// ruta mail
usersRouter.post("/mail", mailUserController);

// ruta sms
usersRouter.post("/sms", smsUserController);

// ruta de roles
usersRouter.put("/premium/:id", checkRole(["admin"]), premiumController);

export default usersRouter;
