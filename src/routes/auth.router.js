import { Router } from "express";
import { passportSignupController, productsRedirectController, passportFailSignup, passportLoginController, passportFailLogin, signupGithubController, signupGithubCallbackController, logoutController } from "../controllers/auth.controller.js";
import { uploaderProfile } from "../utils.js";

const authRouter = Router();

// ruta del registro
authRouter.post("/signup", uploaderProfile.single("avatar") ,passportSignupController, productsRedirectController);
authRouter.get("/failure-signup", passportFailSignup);

// ruta del login
authRouter.post("/login", passportLoginController, productsRedirectController);
authRouter.get("/failure-login", passportFailLogin);

// ruta de github
authRouter.get("/github", signupGithubController);
authRouter.get("/github-callback", signupGithubCallbackController, productsRedirectController);

// ruta del logout
authRouter.post("/logout", logoutController);

export default authRouter;
