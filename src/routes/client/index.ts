import express from "express";

const paths = {
    login : '/login',
    register : '/register',
    me: '/me',
    products: '/products',
    categories: '/categories',
}

const router = express.Router();


export { router, paths };

