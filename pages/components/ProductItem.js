import Product from "@/models/Product";
import db from "@/utils/db";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <Image width={480} height={360} src={product.image} alt={product.name} className="rounded shadow mx-auto mt-5" />
      </Link>

      <div className="flex flex-col items-center justify-center p-3">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="text-sm">{product.brand}</p>
        <p className="text-lg font-semibold">$ {product.price}</p>
        <button className="primary-button" type="button" onClick={() => addToCartHandler(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const product = await Product.find().lean();
  return {
    props: {
      product: product.map(db.convertDocToObj),
    },
  };
}
