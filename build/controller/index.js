"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.getSingleCustomer = exports.getAllCustomer = exports.createCustomer = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default("sk_test_51MY9FkSCQoxW95zLMRveGH4zZwk7bLWZQHIDapj67xusraWPNe6I1YR5muvejK0ZqzS5zPBP65YjpA3xve2n7K2x00GQ9oZGLc", {
    apiVersion: "2022-11-15",
});
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = req.body;
    const params = {
        description: `This is a test customer and name is ${name} and email is ${email}`,
        name,
        email,
    };
    const customer = yield stripe.customers.create(params);
    res.json({ message: "Customer created successfully", customer });
});
exports.createCustomer = createCustomer;
const getAllCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customers = yield stripe.customers.list({
        limit: 10,
    });
    res.json({ message: "Customers fetched successfully", customers });
});
exports.getAllCustomer = getAllCustomer;
const getSingleCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const customer = yield stripe.customers.retrieve(id);
    res.json({ message: "Customer fetched successfully", customer });
});
exports.getSingleCustomer = getSingleCustomer;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Name, email, password } = req.body;
    res.json({ message: "User registered successfully" });
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    res.json({ message: "User registered successfully" });
});
exports.loginUser = loginUser;
