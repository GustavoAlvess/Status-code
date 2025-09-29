import express from "express";
import { 
    getAllBruxos, 
    getBruxoById, 
    createBruxo, 
    updateBruxo, 
    deleteBruxo 
} from "../controllers/bruxosController.js";

const router = express.Router();

// Rotas para bruxos - todas usando ID quando necessário
router.get("/", getAllBruxos);           // GET /bruxos
router.get("/:id", getBruxoById);        // GET /bruxos/:id
router.post("/", createBruxo);           // POST /bruxos
router.put("/:id", updateBruxo);         // PUT /bruxos/:id
router.delete("/:id", deleteBruxo);      // DELETE /bruxos/:id

export default router;