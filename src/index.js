import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userroutes from "./routes/user.routes.js";
import adminroutes from "./routes/admin.routes.js";
import productroutes from "./routes/product.routes.js"
import errorHandling from "./middlewares/errorHandler.js";
import googleAuthRoutes from "./routes/googleAuth.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/uploads', express.static('uploads'));

// routes
app.use("/user", userroutes);
app.use("/admin", adminroutes);
app.use('/api', productroutes);
app.use('/auth', googleAuthRoutes);

// error handling middleware
app.use(errorHandling);


// server running
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
