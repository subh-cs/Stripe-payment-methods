import express from "express";
const router = express.Router();
import { auth } from "../controller/auth";

import {
  loginUser,
  registerUser,
  addPaymentMethod,
  getPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controller";

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/add-payment-method", addPaymentMethod);
router.get("/get-payment-method", getPaymentMethod);
router.patch("/update-payment-method", updatePaymentMethod);
router.delete("/delete-payment-method", deletePaymentMethod);

module.exports = router;
