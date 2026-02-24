"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa6";
import { FaUserAlt, FaSearch } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { getUserSession } from "../lib/session";
import Search from "./Search";
import { useSnapshot } from "valtio";
import { state } from "@/store/state";
import { signOut } from "next-auth/react";
import { categories } from "@/store/constants";
import { useRouter } from "next/navigation";
import { iCart } from "../lib/models/Cart";
// import { iCart } from '../lib/models/Cart';
const Navbar = () => {
  const router = useRouter();
  const snap = useSnapshot(state);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loggedIn, setLoggedIn] = useState<string>();
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      // Check if userString is not null
      try {
        const user = JSON.parse(userString); // No need for String(), localStorage returns a string
        state.user = user;
        setLoggedIn(user._id); // Assume user._id exists and is a valid identifier
      } catch (error) {
        console.error("No User Data found");
      }
    } else {
      console.log("No user data found in localStorage.");
    }
    (async function name() {
      const userSession = await getUserSession();

      const response = await fetch(`/api/profile/`, {
        headers: {
          id: userSession.id,
        },
      });

      const res = await response.json();

      try {
        localStorage.setItem("user", JSON.stringify(res.user));
        state.user = res.user;
        setLoggedIn(res.user);
        state.userId = res.user?.id;
      } catch (error) {
        console.error(error);
      }
    })();
  }, [snap.userId]);
  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await fetch("/api/cart");
        const cart: Array<iCart> = await response.json();
        const totalQuantity = cart.reduce(
          (total, item) => total + Number(item.quantity),
          0,
        );
        state.cartNumber = totalQuantity;
      } catch (error) {
        console.error("cart is empty");
      }
    };
    getCart();
  }, [state.refreshNavbarCart]);

  return (
    <nav className="flex fixed z-30 top-0  justify-between w-screen pl-4 pr-6 md:px-16 py-2 md:text-lg text-purple-800 bg-white drop-shadow-lg">
      <div className="flex gap-3 md:gap-4 items-center    ">
        <Link
          href="/"
          className="hover:underline py-2 font-bold text-lg md:text-2xl"
        >
          ClassyChoice
        </Link>
      </div>
      <div className="flex items-center gap-3 md:gap-4 text-sm md:text-lg font-bolder">
        <div
          className="py-2 cursor-pointer relative"
          onMouseEnter={() => setShowCategoriesDropdown(true)}
          onMouseLeave={() => setShowCategoriesDropdown(false)}
          onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
        >
          <span className="flex gap-1 items-center">
            {" "}
            <button>Categories</button>{" "}
            <span>
              <FaAngleDown />
            </span>
          </span>
          {showCategoriesDropdown ? <CategoriesDropdown /> : ""}
        </div>

        <span
          className="py-2 cursor-pointer flex items-center"
          onClick={() => setShowSearch(true)}
        >
          <FaSearch />
        </span>
        {showSearch ? <Search setShowSearch={setShowSearch} /> : ""}
        {snap.user?.accountType == "admin" ? (
          ""
        ) : (
          <button
            onClick={() =>
              snap.user
                ? router.push("/account/cart")
                : router.push("/api/auth/signin")
            }
            className="py-1 cursor-pointer flex items-center relative"
          >
            <FiShoppingCart />
            <span className="absolute top-[-7px] right-[-17px] text-sm bg-purple-800 text-white rounded-full px-2">
              {snap.cartNumber}
            </span>
          </button>
        )}
        {loggedIn ? (
          <span
            className="py-2 cursor-pointer flex relative ml-2 items-center"
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
          >
            <FaUserAlt />
            <FaAngleDown /> {showAccountDropdown ? <AccountDropdown /> : ""}
          </span>
        ) : (
          <Link
            href={"/api/auth/signin"}
            className="text-sm py-1.5 border border-purple-800 px-2 md:px-6 ml-4 rounded-md"
          >
            SIGN IN
          </Link>
        )}
      </div>
    </nav>
  );
};
const CategoriesDropdown = () => {
  // const snap= useSnapshot(state)
  const router = useRouter();
  function navigateToCategories(category: string) {
    // state.filter = {
    //   category: category,
    //   maxAmount: 1000000,
    //   minAmount: 0,
    //   searchQuery: "",
    //   subCategory: "",
    // };
    router.push(`/search?category=${category}`);
  }
  return (
    <div className="absolute top-8 left-[-30px] w-fit bg-white p-4 rounded-md flex flex-col drop-shadow-md text-sm">
      {categories.map((category) => (
        <button
          key={category.mainCategory}
          onClick={() => {
            navigateToCategories(category.mainCategory);
          }}
          className="p-2 text-left  text-nowrap hover:drop-shadow-lg rounded-md bg-white"
        >
          {category.mainCategory}
          {category.subCategories.length ? "" : ""}
        </button>
      ))}
    </div>
  );
};
const AccountDropdown = () => {
  const snap = useSnapshot(state);
  return (
    <>
      {snap.user?.accountType == "admin" ? (
        <div className="absolute top-6 left-[-100px] w-fit bg-white p-4 rounded-md flex flex-col drop-shadow-md text-sm">
          <Link
            href={"/dashboard/products"}
            className="p-2 w-32 text-nowrap hover:drop-shadow-lg rounded-md bg-white"
          >
            Products
          </Link>
          {/* <Link href={"/account/cart"} className='p-2 text-nowrap hover:drop-shadow-lg rounded-md bg-white'>Cart</Link>
      <Link href={"/account/profile"} className='p-2 text-nowrap hover:drop-shadow-lg rounded-md bg-white'>Likes</Link> */}
          <Link
            href={"/dashboard/orders"}
            className="p-2 text-nowrap hover:drop-shadow-lg rounded-md bg-white"
          >
            Orders
          </Link>
          <button
            onClick={() => signOut()}
            className="p-2 text-nowrap hover:drop-shadow-lg rounded-md bg-white text-left"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="absolute top-6 left-[-100px] w-fit bg-white p-4 rounded-md flex flex-col drop-shadow-md text-sm">
          <Link
            href={"/account/profile"}
            className="p-2 w-32 text-nowrap hover:drop-shadow-lg rounded-md bg-white"
          >
            Account Profile
          </Link>
          <Link
            href={"/account/cart"}
            className="p-2 text-nowrap hover:drop-shadow-lg rounded-md bg-white"
          >
            Cart
          </Link>
          {/* <Link href={"/account/profile"} className='p-2 text-nowrap hover:drop-shadow-lg rounded-md bg-white'>Likes</Link> */}
          <Link
            href={"/account/orders"}
            className="p-2 text-nowrap hover:drop-shadow-lg rounded-md bg-white"
          >
            Orders
          </Link>
          <button
            onClick={() => {
              signOut();
              localStorage.setItem("user", "");
            }}
            className="p-2 text-nowrap hover:drop-shadow-lg rounded-md bg-white text-left"
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
