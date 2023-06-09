import { getError } from "@/utils/error";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../components/Layout";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function AdminDashboardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    const fetcData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };

    fetcData();
  }, []);

  const data = {
    labels: summary.salesData.map((x) => x._id), //2023/01 2023/03
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(150, 200, 198, 1)",
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <div className="font-bold text-blue-700">Dashboard</div>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders">
                <div className="text-blue-700">Orders</div>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">
                <div className="text-blue-700">Products</div>
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
          <h1 className="mb-4 text-xl">Admin Dashboard</h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="card m-5 p-5">
                  <p className="text-3xl">${summary.ordersPrice}</p>
                  <p>Sales</p>
                  <Link href="/admin/orders">View Sales</Link>
                </div>
                <div className="card m-5 p-5">
                  <p className="text-3xl">${summary.ordersCount}</p>
                  <p>Orders</p>
                  <Link href="/admin/orders">View Orders</Link>
                </div>
                <div className="card m-5 p-5">
                  <p className="text-3xl">${summary.productsCount}</p>
                  <p>Products</p>
                  <Link href="/admin/products">View Products</Link>
                </div>
                <div className="card m-5 p-5">
                  <p className="text-3xl">${summary.usersCount}</p>
                  <p>Users</p>
                  <Link href="/admin/users">View Users</Link>
                </div>
              </div>
              <h2 className="text-xl">Sales Report</h2>
              <Bar
                options={{
                  legend: { display: true, position: "right" },
                }}
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
