"use client";
import { categories } from "@/store/constants";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react"; // Added Suspense
import { AiOutlineClose } from "react-icons/ai";
import { useSearchParams } from "next/navigation";

const SearchTagsContent = () => {
  const searchParams = useSearchParams();
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const query = searchParams.get("query") || "";

  const [minAmount, setMinAmount] = useState(
    Number(searchParams.get("minAmount")) || 0,
  );
  const [maxAmount, setMaxAmount] = useState(
    Number(searchParams.get("maxAmount")) || 10000000,
  );
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const [subCategory, setSubCategory] = useState(
    searchParams.get("subCategory") || "",
  );

  const router = useRouter();

  const redirectToSearch = (overrides = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    if (minAmount !== 0) params.set("minAmount", minAmount.toString());
    else params.delete("minAmount");

    if (maxAmount !== 10000000) params.set("maxAmount", maxAmount.toString());
    else params.delete("maxAmount");

    if (category) params.set("category", category);
    if (subCategory) params.set("subCategory", subCategory);
    if (query) params.set("query", query);

    Object.entries(overrides).forEach(([key, value]) => {
      if (value) {
        params.set(key, value as string);
      } else {
        params.delete(key);
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    setMinAmount(Number(searchParams.get("minAmount")) || 0);
    setMaxAmount(Number(searchParams.get("maxAmount")) || 10000000);
    setCategory(searchParams.get("category") || "");
    setSubCategory(searchParams.get("subCategory") || "");
  }, [searchParams]);

  return (
    <div className="flex flex-wrap w-full text-purple-900 gap-2 relative">
      {category && (
        <div
          onMouseLeave={() => setShowCategoriesDropdown(false)}
          className="border border-purple-900 px-4 py-1.5 rounded-md flex items-center gap-1 relative"
        >
          <span
            className="cursor-pointer"
            onClick={() => setShowCategoriesDropdown(true)}
          >
            {category}
          </span>
          <span
            className="text-lg cursor-pointer"
            onClick={() => {
              setCategory("");
              setSubCategory("");
              redirectToSearch({ category: "", subCategory: "" });
            }}
          >
            <AiOutlineClose />
          </span>
          {showCategoriesDropdown && (
            <div className="absolute bg-white drop-shadow-lg p-3 rounded-md top-8 flex flex-col z-30">
              {categories.map((category) => (
                <span
                  onClick={() => {
                    const newCat = category.mainCategory;
                    setCategory(newCat);
                    redirectToSearch({ category: newCat });
                    setShowCategoriesDropdown(false);
                  }}
                  key={category.mainCategory}
                  className="cursor-pointer bg-white p-2 rounded-md hover:drop-shadow-lg w-full text-nowrap"
                >
                  {category.mainCategory}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {!(minAmount == 0 && maxAmount == 10000000) && (
        <div
          onMouseLeave={() => setShowPriceDropdown(false)}
          className=" border border-purple-900 px-4 py-1.5 rounded-md flex items-center gap-1"
        >
          <span
            onClick={() => setShowPriceDropdown(true)}
            className="cursor-pointer"
          >
            {minAmount}-{maxAmount}{" "}
          </span>
          <span
            className="text-lg cursor-pointer"
            onClick={() => {
              setMinAmount(0);
              setMaxAmount(10000000);
              redirectToSearch({ minAmount: "0", maxAmount: "10000000" });
            }}
          >
            <AiOutlineClose />
          </span>
          {showPriceDropdown && (
            <div className="absolute bg-white drop-shadow-lg p-3 rounded-md flex flex-col gap-2 left-0 top-8 z-30">
              <p className="font-bold">Price(N)</p>
              <div className=" flex gap-3 items-center">
                <input
                  value={minAmount}
                  onChange={(e) => setMinAmount(Number(e.target.value))}
                  type="number"
                  className="outline outline-[1px] outline-purple-800 rounded-md p-2 w-32"
                />
                <span className="font-bold text-lg">-</span>
                <input
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(Number(e.target.value))}
                  type="number"
                  className="outline outline-[1px] outline-purple-800 rounded-md p-2 w-32"
                />
              </div>
              <button
                className="bg-purple-900 text-white py-2 rounded-md"
                onClick={() => {
                  redirectToSearch({
                    minAmount: minAmount.toString(),
                    maxAmount: maxAmount.toString(),
                  });
                  setShowPriceDropdown(false);
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}
      {subCategory && (
        <div className="border border-purple-900 px-4 py-1.5 rounded-md flex items-center gap-1">
          <span className="cursor-pointer">{subCategory}</span>
          <span
            className="text-lg cursor-pointer"
            onClick={() => {
              setSubCategory("");
              redirectToSearch({ subCategory: "" });
            }}
          >
            <AiOutlineClose />
          </span>
        </div>
      )}
    </div>
  );
};

// Wrapper with Suspense
const SearchTags = () => {
  return (
    <Suspense fallback={null}>
      <SearchTagsContent />
    </Suspense>
  );
};

export default SearchTags;
