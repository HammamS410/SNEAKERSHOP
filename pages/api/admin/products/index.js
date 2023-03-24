import Product from "@/models/Product";
import db from "@/utils/db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send({ message: "admin signin required" });
  }
  // const { user } = session;
  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const postHandler = async (req, res) => {
  await db.connect();
  const newProduct = Product({
    name: "sample name",
    slug: "sample-name-" + Math.random(),
    category: "sample category",
    image: "/images/Adidas Matchcourt 1.jpg",
    price: 0,
    brand: "sample brand",
    rating: 0,
    numReviews: 0,
    countInstock: 0,
    discount: 5,
    description: "sample description",
  });
  await db.disconnect();
  res.send({ message: "Product successfully created" }, newProduct);
};

const getHandler = async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
  console.log(products);
};

export default handler;
