import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import { notFoundError, errorHandler } from "./middlewares/error-handler.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import astuceRoutes from "./routes/astuceRoutes.js";
import experienceAstuceRoutes from "./routes/experienceAstuceRoutes.js"
import avisdestinationRoutes from './routes/avisdestinationRoutes.js';
import categorieRoutes from './routes/categorieRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import CategorieDestinationRoutes from './routes/CategorieDestinationRoutes.js';
import dotenv from 'dotenv';
// dotenv.config();
import usersRoutes from './routes/userRoutes.js'
const app = express();
const port = process.env.PORT || 9090;
const databaseName = "TirFlyBD";
const db_url = process.env.DB_URL || `mongodb://127.0.0.1:27017`;
dotenv.config({ path: ".env" });
mongoose.set("debug", true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`${db_url}/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/img", express.static("public/images"));
app.use('/users', usersRoutes)
app.use("/experience", experienceRoutes);
app.use("/astuce", astuceRoutes);
app.use("/experienceAstuce", experienceAstuceRoutes);
app.use('/destination', destinationRoutes);
app.use('/categorie', categorieRoutes);
app.use('/avis', avisdestinationRoutes);
app.use('/categoriedestination', CategorieDestinationRoutes);
app.use(notFoundError);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});