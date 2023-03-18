import express from "express";
import {
  makeCurrencyUpdate,
  makeWithdrawal,
} from "../controllers/controller_atm";

export const atmRoutes = express.Router();
atmRoutes.post("/atm/withdrawal", makeWithdrawal);
atmRoutes.post("/admin/currency", makeCurrencyUpdate);
