import { Request, Response } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Prisma client
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// Stripe
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51MY9FkSCQoxW95zLMRveGH4zZwk7bLWZQHIDapj67xusraWPNe6I1YR5muvejK0ZqzS5zPBP65YjpA3xve2n7K2x00GQ9oZGLc",
  {
    apiVersion: "2022-11-15",
  }
);
// controller functions
export const createCustomer = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const params: Stripe.CustomerCreateParams = {
    description: `This is a test customer and name is ${name} and email is ${email}`,
    name,
    email,
  };
  const customer: Stripe.Customer = await stripe.customers.create(params);
  res.json({ message: "Customer created successfully", customer });
};

export const getAllCustomer = async (req: Request, res: Response) => {
  const customers = await stripe.customers.list({
    limit: 10,
  });
  res.json({ message: "Customers fetched successfully", customers });
};

export const getSingleCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await stripe.customers.retrieve(id);
  res.json({ message: "Customer fetched successfully", customer });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.json({ message: "Please enter all fields" });
    // DB logic
    // 1. Check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return res.json({ message: "User already exists" });
    }
    // 2. If not, create user in DB and stripe customer and save customer id in DB and also save the password as hash
    // Hash password
    const HashedPassword = await bcrypt.hash(password, 10);
    // Create customer in stripe
    const params: Stripe.CustomerCreateParams = {
      description: `This is a test customer and name is ${name} and email is ${email}`,
      name,
      email,
    };
    const customer: Stripe.Customer = await stripe.customers.create(params);
    // Create user in DB
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: HashedPassword,
        stripeId: customer.id,
      },
    });
    // 3. return success message
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    // console.log((error as Error).message)
    res.status(500).json({ message: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "Please enter all fields" });
    }
    // DB logic
    // 1. check if user exists or not
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "User does not exist!" });
    }
    // 2. check if password is correct or not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password!" });
    }
    // 3. generate jwt token and return with success message
    const token = await jwt.sign(
      { id: user.id, stripeId: user.stripeId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// add payment method and attach it to current logged in user
export const addPaymentMethod = async (req: any, res: Response) => {
  try {
    const stripeId = req.stripeId;
    const { type, card } = req.body;
    // DB logic
    // create a payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: type,
      card: card,
    });
    // attach payment method to the user
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: stripeId,
    });
    res.status(200).json({ message: "Payment method added successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getPaymentMethod = async (req: any, res: Response) => {
  try {
    const stripeId = req.stripeId;
    const paymentMethodId = req.query.id;
    if (!paymentMethodId) {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: stripeId,
      });
      return res.status(200).json({
        message: `Total ${paymentMethods.data.length} Payment methods fetched successfully`,
        paymentMethods,
      });
    }
    const paymentMethod = await stripe.paymentMethods.retrieve(
      String(paymentMethodId)
    );
    res.status(200).json({
      message: "Payment method fetched by id successfully",
      paymentMethod,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updatePaymentMethod = async (req: any, res: Response) => {
  try {
    const paymentMethodId = req.query.id;
    const { billing_details, card } = req.body;
    const paymentMethod = await stripe.paymentMethods.update(
      String(paymentMethodId),
      {
        billing_details,
        card,
      }
    );
    res.status(200).json({
      message: "Payment method updated successfully",
      paymentMethod,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deletePaymentMethod = async (req: any, res: Response) => {
  try {
    const paymentMethodId = req.query.id;
    const paymentMethod = await stripe.paymentMethods.detach(
      String(paymentMethodId)
    );
    res.status(200).json({
      message: "Payment method deleted successfully",
      paymentMethod,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const dummyResponse = async (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
};
