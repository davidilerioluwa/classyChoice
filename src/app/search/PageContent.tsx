"use client";
import React, { useEffect, useState } from "react";
import ProductsCard from "../components/ProductsCard";
import { iProduct } from "../lib/models/Product";
import PacmanLoader from "react-spinners/PacmanLoader";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Search from "../components/Search";
import CreateNewListingForm from "../components/CreateNewListingForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SearchTags from "../components/SearchTags";
import { useSearchParams } from "next/navigation";

const PageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [filter, setFilter] = useState({
    searchQuery: query,
    minAmount: Number(searchParams.get("minAmount")) || 0,
    maxAmount: Number(searchParams.get("maxAmount")) || 10000000,
    category: searchParams.get("category") || "",
    subCategory: searchParams.get("subCategory") || "",
  });
  const router = useRouter();
  const [products, setProducts] = useState<Array<iProduct>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [EditListingId, setEditListingId] = useState("");
  const [deleteListingId, setDeleteListingId] = useState("");
  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const deleteProduct = async () => {
    toast.loading("Deleting..."); // Using loading state in toast is cleaner
    const response = await fetch("/api/products", {
      method: "PUT",
      body: JSON.stringify(deleteListingId),
    });

    if (response.ok) {
      // 1. Remove from local state immediately
      setProducts((prev) => prev.filter((p) => p.id !== deleteListingId));
      // 2. Close the modal
      setShowAreYouSure(false);
      // 3. Show success
      toast.success("Item has been successfully deleted");
      // 4. Refresh server cache
      router.refresh();
    } else {
      toast.error("Failed to delete item");
    }
  };

  const AreYouSure = ({
    setShowAreYouSure,
  }: {
    setShowAreYouSure: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <div
        className={`fixed top-0 w-screen h-screen flex items-center justify-center bg-opacity-50 bg-black z-50 left-0`}
      >
        <div className="w-fit text-sm sm:text-md p-4 sm:p-8 bg-white rounded-md flex flex-col gap-4 justify-center items-center">
          <p>Are You Sure You Want To Delete This Listing</p>
          <div className="flex w-full  justify-between">
            <button
              onClick={() => deleteProduct()}
              className=" px-12 py-1.5  bg-green-800 rounded-md text-white"
            >
              Yes
            </button>
            <button
              onClick={() => setShowAreYouSure(false)}
              className=" px-12 py-1.5  bg-red-600 rounded-md text-white"
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  };
  const search = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // state.filter.searchQuery = searchQuery;
    const url = `/search?query=${filter.searchQuery}&minAmount=${filter.minAmount}&maxAmount=${filter.maxAmount}&category=${filter.category}&subCategory=${filter.subCategory}`;
    router.push(url);

    setShowSearch(false);
  };
  useEffect(() => {
    // done to enable search query textfield to update when the url changes, this is because when the url changes the search component doesnt unmount it just updates the search query in the url, so we need to update the search query state to reflect the change in the url
    setFilter({
      searchQuery: searchParams.get("query") || "",
      minAmount: Number(searchParams.get("minAmount")) || 0,
      maxAmount: Number(searchParams.get("maxAmount")) || 10000000,
      category: searchParams.get("category") || "",
      subCategory: searchParams.get("subCategory") || "",
    });
    (async function getProducts() {
      setIsLoading(true);
      const filter = new URLSearchParams({
        query: searchParams.get("query") || "",
        minAmount: searchParams.get("minAmount") || "0",
        maxAmount: searchParams.get("maxAmount") || "10000000",
        category: searchParams.get("category") || "",
        subCategory: searchParams.get("subCategory") || "",
      });
      try {
        const response = await fetch(`/api/products?${filter}`, {
          method: "GET",
        });
        const products = await response.json();
        setIsLoading(false);
        // checks to see if the products have a length, and if it doesnt it does set the products state
        if (products.length) {
          setProducts(products);
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      }
    })();
  }, [searchParams]);
  return (
    <div className="pt-24 px-4 lg:px-6 py-4 h-full min-h-screen">
      {showAreYouSure && <AreYouSure setShowAreYouSure={setShowAreYouSure} />}
      {showListingForm ? (
        <CreateNewListingForm
          setShowListingForm={setShowListingForm}
          EditListingId={EditListingId}
        />
      ) : (
        ""
      )}
      {showSearch ? <Search setShowSearch={setShowSearch} /> : ""}
      <form onSubmit={(e) => search(e)} className="w-full flex gap-2 mb-4 ">
        <input
          type="text"
          value={filter.searchQuery}
          onChange={(e) =>
            setFilter({ ...filter, searchQuery: e.target.value })
          }
          className="w-full px-2 text-purple-900 outline outline-[1px] outline-purple-900 rounded-md"
        />
        <button
          className="bg-purple-900 px-4 py-2 rounded-md text-white text-3xl"
          type="button"
          onClick={() => {
            setShowSearch(true);
            console.log(showSearch);
          }}
        >
          <HiAdjustmentsHorizontal />
        </button>
        <button
          className="bg-purple-900 px-4 py-2 rounded-md text-white"
          type="submit"
        >
          Search
        </button>
      </form>
      <SearchTags />
      <div className="  w-full rounded-md py-4">
        {!isLoading && (
          <span className="font-bold text-sm py-2 mb-4 text-purple-900">
            {products.length ? products.length + " results" : ""}
          </span>
        )}
        <div>
          {isLoading ? (
            <PacmanLoader color="rgb(88 28 135 / var(--tw-text-opacity, 1))" />
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
              {products.length
                ? products.map((product) => (
                    <ProductsCard
                      setShowAreYouSure={setShowAreYouSure}
                      setDeleteListingId={setDeleteListingId}
                      setEditListingId={setEditListingId}
                      setShowListingForm={setShowListingForm}
                      product={product}
                      key={product.id}
                    />
                  ))
                : "No Items Found, Please Try a new search"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageContent;
