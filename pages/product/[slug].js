import data from "@/utils/data";
import { Store } from "@/utils/Store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Layout from "../components/Layout";

export default function ProductScreen() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((x) => x.slug === slug);
  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      alert("Sorry Product is Out of Stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };
  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image src={product.image} alt={product.name} layout="responsive" width={640} height={640} />
        </div>
        <div>
          <ul>
            <li>
              <h2 className="text-lg font-semibold">{product.name}</h2>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price: </div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "Stock Available" : "Out of Stock"}</div>
            </div>
            <button className="primary-button w-full" onClick={addToCartHandler}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
