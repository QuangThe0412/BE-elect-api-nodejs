import express from "express";
import routerAuth from "./auth.route";

const paths = {
    auth: '/auth',
    products: '/products',
    categories: '/categories',
}

const router = express.Router();

router.use(paths.auth, routerAuth);
// router.use(paths.mon, adminAuthMiddleware, routerMon);


export { router, paths };

