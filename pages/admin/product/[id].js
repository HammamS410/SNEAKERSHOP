import Layout from "@/pages/components/Layout";
import { getError } from "@/utils/error";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function AdminProductEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("image", data.image);
        setValue("featuredImage", data.featuredImage);
        setValue("category", data.category);
        setValue("brand", data.brand);
        setValue("countInStock", data.countInStock);
        setValue("description", data.description);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [productId, setValue]);

  const router = useRouter();

  const submitHandler = async ({ name, slug, price, category, image, brand, countInStock, description }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Product successfully updated");
      router.push("/admin/products");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(error) });
      toast.error(getError(error));
    }
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <div className="text-blue-700">Dashboard</div>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders">
                <div className=" text-blue-700">Orders</div>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">
                <div className="text-blue-700 font-bold">Products</div>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <div className="text-blue-700">Users</div>
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
              <h1 className="mb-4 text-xl">{`Edit Product ${productId}`}</h1>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="w-full"
                  id="name"
                  autoFocus
                  {...register("name", {
                    required: "Please enter name",
                  })}
                />
                {errors.name && <div className="text-red-600">{errors.name.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  className="w-full"
                  id="slug"
                  {...register("slug", {
                    required: "Please enter slug",
                  })}
                />
                {errors.slug && <div className="text-red-600">{errors.slug.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="w-full"
                  id="price"
                  {...register("price", {
                    required: "Please enter price",
                  })}
                />
                {errors.price && <div className="text-red-600">{errors.price.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="image">Image</label>
                <input
                  type="text"
                  className="w-full"
                  id="image"
                  {...register("image", {
                    required: "Please add image",
                  })}
                />
                {errors.image && <div className="text-red-600">{errors.image.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  className="w-full"
                  id="category"
                  {...register("category", {
                    required: "Please enter category",
                  })}
                />
                {errors.category && <div className="text-red-600">{errors.category.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="w-full"
                  id="brand"
                  {...register("brand", {
                    required: "Please enter brand",
                  })}
                />
                {errors.brand && <div className="text-red-600">{errors.brand.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">Stock</label>
                <input
                  type="number"
                  className="w-full"
                  id="countInStock"
                  {...register("countInStock", {
                    required: "Please enter stock",
                  })}
                />
                {errors.countInStock && <div className="text-red-600">{errors.countInStock.message}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  className="w-full"
                  id="description"
                  cols={30}
                  rows={10}
                  {...register("description", {
                    required: "Please enter description",
                  })}
                />
                {errors.description && <div className="text-red-600">{errors.description.message}</div>}
              </div>
              <div className="mb-4">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? "Loading" : "Update"}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/products`}>
                  <div className="text-blue-700">Back</div>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductEditScreen.auth = { adminOnly: true };
