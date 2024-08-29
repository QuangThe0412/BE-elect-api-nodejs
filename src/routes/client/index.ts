import express from "express";
import routerAuth from "./auth.route";
import routerProducts from "./products.route"
import routerCategories from "./categories.route";
import authMiddleware from "../../middlewares/auth.middleware";
import routerAccount from "./account.route";
import routerCart from "./cart";

const paths = {
    auth: '/auth',
    products: '/products',
    categories: '/categories',
    account: '/account',
    cart: '/cart',
}

const router = express.Router();

router.use('/client' + paths.auth, routerAuth);
router.use('/client' + paths.products, routerProducts);
router.use('/client' + paths.categories, routerCategories);
router.use('/client' + paths.account, authMiddleware, routerAccount);
router.use('/client' + paths.cart, authMiddleware, routerCart);

export { router, paths };

