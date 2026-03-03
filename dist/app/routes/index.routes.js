"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const cow_route_1 = require("../modules/Cow/cow.route");
const order_route_1 = require("../modules/Order/order.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users/",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/cows/",
        route: cow_route_1.CowRoutes,
    },
    {
        path: "/orders/",
        route: order_route_1.OrderRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
