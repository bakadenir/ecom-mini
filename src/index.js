import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from '@prisma/client';

dotenv.config(); 

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT; 

app.use(express.json());

app.get("/", (req, res) => {
  res.send("I dont Know")
})

app.get("/products", async (req, res) => {
  const products  = await prisma.product.findMany();

  res.send(products);
})

app.post("/products", async (req, res) => {
  const newProductData = req.body;

  const products  = await prisma.product.create({
    data: {
      name: newProductData.name,
      price: newProductData.price,
      description: newProductData.description,
      image: newProductData.image,
    }
  });

  res.status(201).send("Create product success");
})




app.listen(PORT, () => {
    console.log(`✅ Server Running on port ${PORT}`);
});