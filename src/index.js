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

// GET Product
app.get("/products", async (req, res) => {
  const products  = await prisma.product.findMany();

  res.send(products);
})

// POST Product
app.post("/products", async (req, res) => {
  const newProductData = req.body;

  const product  = await prisma.product.create({
    data: {
      name: newProductData.name,
      price: newProductData.price,
      description: newProductData.description,
      image: newProductData.image,
    },
  });

  res.send({
    data: product,
    message: "Create product success"
  });
});

// Delete Product
app.delete("/products/:id", async (req, res) => {
  const productId = Number(req.params.id);

  const deleteProduct = await prisma.product.delete({
    where : {
      id : productId,
    },
  });

  res.send({
    data: deleteProduct,
    message: "Delete product success"
  });
});

// Put
app.put ("/products/:id", async (req, res) => {
  const productId = Number(req.params.id);
  const productData = req.body;

  if(!(productData.name && productData.price && productData.description && productData.image)) {
    return res.send("Fields is missing!");
  }

  const putProduct = await prisma.product.update({
    where : {
      id : productId,
    },

    data: {
      name: productData.name,
      price: productData.price,
      description: productData.description,
      image: productData.image,
    },
  });

  res.send({
    data: putProduct,
    message: "Edit product success"
  });
});

// PATCH
app.patch ("/products/:id", async (req, res) => {
  const productId = Number(req.params.id);
  const productData = req.body;

  const putProduct = await prisma.product.update({
    where : {
      id : productId,
    },

    data: {
      name: productData.name,
      price: productData.price,
      description: productData.description,
      image: productData.image,
    },
  });

  res.send({
    data: putProduct,
    message: "Edit product success"
  });
});




app.listen(PORT, () => {
    console.log(`✅ Server Running on port ${PORT}`);
});