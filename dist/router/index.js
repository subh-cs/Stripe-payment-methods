"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../controller/auth");
const controller_1 = require("../controller");
router.get("/", controller_1.dummyResponse);
router.post("/register", controller_1.registerUser);
router.post("/login", controller_1.loginUser);
router.post("/add-payment-method", auth_1.auth, controller_1.addPaymentMethod);
router.get("/get-payment-method", auth_1.auth, controller_1.getPaymentMethod);
router.patch("/update-payment-method", auth_1.auth, controller_1.updatePaymentMethod);
router.delete("/delete-payment-method", auth_1.auth, controller_1.deletePaymentMethod);
module.exports = router;
