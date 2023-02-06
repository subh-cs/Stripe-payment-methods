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
exports.dummyResponse = exports.deletePaymentMethod = exports.updatePaymentMethod = exports.getPaymentMethod = exports.addPaymentMethod = exports.loginUser = exports.registerUser = exports.getSingleCustomer = exports.getAllCustomer = exports.createCustomer = void 0;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Prisma client
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Stripe
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default("sk_test_51MY9FkSCQoxW95zLMRveGH4zZwk7bLWZQHIDapj67xusraWPNe6I1YR5muvejK0ZqzS5zPBP65YjpA3xve2n7K2x00GQ9oZGLc", {
    apiVersion: "2022-11-15",
});
// controller functions
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
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.json({ message: "Please enter all fields" });
        // DB logic
        // 1. Check if user already exists
        const user = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (user) {
            return res.json({ message: "User already exists" });
        }
        // 2. If not, create user in DB and stripe customer and save customer id in DB and also save the password as hash
        // Hash password
        const HashedPassword = yield bcrypt.hash(password, 10);
        // Create customer in stripe
        const params = {
            description: `This is a test customer and name is ${name} and email is ${email}`,
            name,
            email,
        };
        const customer = yield stripe.customers.create(params);
        // Create user in DB
        const newUser = yield prisma.user.create({
            data: {
                name,
                email,
                password: HashedPassword,
                stripeId: customer.id,
            },
        });
        // 3. return success message
        res.status(200).json({ message: "User registered successfully" });
    }
    catch (error) {
        // console.log((error as Error).message)
        res.status(500).json({ message: error.message });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ message: "Please enter all fields" });
        }
        // DB logic
        // 1. check if user exists or not
        const user = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(401).json({ message: "User does not exist!" });
        }
        // 2. check if password is correct or not
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password!" });
        }
        // 3. generate jwt token and return with success message
        const token = yield jwt.sign({ id: user.id, stripeId: user.stripeId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({
            message: "Logged in successfully",
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
// add payment method and attach it to current logged in user
const addPaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stripeId = req.stripeId;
        const { type, card } = req.body;
        // DB logic
        // create a payment method
        const paymentMethod = yield stripe.paymentMethods.create({
            type: type,
            card: card,
        });
        // attach payment method to the user
        yield stripe.paymentMethods.attach(paymentMethod.id, {
            customer: stripeId,
        });
        res.status(200).json({ message: "Payment method added successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addPaymentMethod = addPaymentMethod;
const getPaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stripeId = req.stripeId;
        const paymentMethodId = req.query.id;
        if (!paymentMethodId) {
            const paymentMethods = yield stripe.paymentMethods.list({
                customer: stripeId,
            });
            return res.status(200).json({
                message: `Total ${paymentMethods.data.length} Payment methods fetched successfully`,
                paymentMethods,
            });
        }
        const paymentMethod = yield stripe.paymentMethods.retrieve(String(paymentMethodId));
        res.status(200).json({
            message: "Payment method fetched by id successfully",
            paymentMethod,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getPaymentMethod = getPaymentMethod;
const updatePaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentMethodId = req.query.id;
        const { billing_details, card } = req.body;
        const paymentMethod = yield stripe.paymentMethods.update(String(paymentMethodId), {
            billing_details,
            card,
        });
        res.status(200).json({
            message: "Payment method updated successfully",
            paymentMethod,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updatePaymentMethod = updatePaymentMethod;
const deletePaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentMethodId = req.query.id;
        const paymentMethod = yield stripe.paymentMethods.detach(String(paymentMethodId));
        res.status(200).json({
            message: "Payment method deleted successfully",
            paymentMethod,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deletePaymentMethod = deletePaymentMethod;
const dummyResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "Hello World" });
});
exports.dummyResponse = dummyResponse;
