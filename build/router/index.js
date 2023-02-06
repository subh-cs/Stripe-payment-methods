"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controller_1 = require("../controller");
// registerUser is a function that returns a promise
router.post("/register", controller_1.registerUser);
// 
// router.post("/login", loginUser);
router.get("/get-customer", controller_1.getAllCustomer);
router.get("/get-customer/:id", controller_1.getSingleCustomer);
router.post("/add-customer", controller_1.createCustomer);
router.get("/payment-methods", (req, res) => {
    res.json({ message: "User registered successfully" });
});
router.post("/payment-methods/add", (req, res) => {
    res.json({ message: "Payment method added successfully" });
});
router.patch("/payment-methods/update", (req, res) => {
    res.json({ message: "Payment updated successfully" });
});
router.delete("/payment-methods/delete", (req, res) => {
    res.json({ message: "Payment method deleted successfully" });
});
module.exports = router;
