import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import { Request, Response, NextFunction } from "express"; 
import httpStatus from "http-status"; 
import GlobalErrorHandler from "./middlewares/globalErrorHandler.js";
import { AuthRouters } from "./auth/auth.routes.js";


dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", AuthRouters);

app.use("/", (req, res) => {
    res.json({ message: "Hello from auth server!" });
});

const PORT = process.env.PORT || 5000;





app.use(GlobalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});



app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}`);
    connectDB();
})

