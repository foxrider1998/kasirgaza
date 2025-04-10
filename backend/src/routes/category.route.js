import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  getSalesByCategory,
} from "../controllers/kategory.controller.js";
import { autenticate } from "../controllers/error.controller.js";
const categoryRoute = Router();

categoryRoute.get("/categorys/sales", autenticate, getSalesByCategory);
categoryRoute.get("/categorys", autenticate, getAllCategory);
categoryRoute.get("/categorys/:id", autenticate, getCategoryById);
categoryRoute.post("/categorys", autenticate, createCategory);
categoryRoute.put("/categorys/:id", autenticate, updateCategory);
categoryRoute.delete("/categorys/:id", autenticate, deleteCategory);
export default categoryRoute;