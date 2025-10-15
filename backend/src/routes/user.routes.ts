import { Router } from "express";

const router = Router();

router.post("/signup", (req, res) => {
  res.send("Signup endpoint working ✅");
});

export default router;