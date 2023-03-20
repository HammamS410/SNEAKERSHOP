import { Store } from "@/utils/Store";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";
import Cookies from "js-cookie";

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();
  const { dispatch, state } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <Head>
        <title>{title ? title + " - BLOCK!SNEAKERS.CO" : "BLOCK!SNEAKERS.CO"}</title>
        <meta name="description" content="Sneakers Shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 items-center justify-between shadow-md px-4">
            <Link href="/" className="text-lg font-bold">
              BLOCK!SNEAKERS.CO
            </Link>
            <div>
              <Link href="/cart" className="p-2">
                Cart
                {cartItemsCount > 0 && <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">{cartItemsCount}</span>}
              </Link>

              {status === "loading" ? (
                "loading"
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-indigo-800 font-semibold">{session.user.name}</Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top shadow-lg bg-slate-100">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/order-history">
                        Order History
                      </DropdownLink>
                    </Menu.Item>

                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink className="dropdown-link" href="/admin/dashboard">
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}

                    <Menu.Item>
                      <div className="dropdown-link" href="#" onClick={logoutClickHandler}>
                        Logout
                      </div>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">Login</Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">BLOCK!SNEAKERS.CO @ 2023</footer>
      </div>
    </>
  );
}
