import express from "express";
import routerAuth from "./auth.route";
import routerProducts from "@routes/client/products.route";
import routerCategories from "@routes/client/categories.route";

const paths = {
    auth: '/auth',
    products: '/products',
    categories: '/categories',
}

const router = express.Router();

router.use(paths.auth, routerAuth);
router.use(paths.products, routerProducts);
router.use(paths.categories, routerCategories);

export { router, paths };

