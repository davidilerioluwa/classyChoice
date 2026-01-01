import React, { useEffect, useState } from "react";
import { iProduct } from "../lib/models/Product";
import { state } from "@/store/state";
import { useSnapshot } from "valtio";
import { toast } from "sonner";
import Image from "next/image";
import { GoDash } from "react-icons/go";
import { iCart } from "../lib/models/Cart";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
// import { iCheckoutDetails } from "../account/cart/page";

const ProductsCard = ({
  product,
  setEditListingId,
  setShowListingForm,
  setDeleteListingId,
  setShowAreYouSure,
}: {
  product: iProduct;
  setEditListingId: React.Dispatch<React.SetStateAction<string>>;
  setShowListingForm: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteListingId: React.Dispatch<React.SetStateAction<string>>;
  setShowAreYouSure: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const snap = useSnapshot(state);
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [cartItem, setCartItem] = useState<iCart>();
  const reduceQuantity = async () => {
    toast("updating your cart");
    // disable payment button
    if (Number(cartItem?.quantity) !== 1) {
      try {
        const response = await fetch(`/api/cart`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: Number(cartItem?.quantity) - 1,
            cartId: cartItem?._id,
          }),
        });
        const res = await response.json();

        if (res.message == "cart has been sucessfully updated") {
          toast.success(res.message);
          CheckIfProductAlreadyInCart();
        }
      } catch {}
    } else {
      removeFromCart();
    }
  };
  const increaseQuantity = async () => {
    toast("updating your cart");
    try {
      const response = await fetch(`/api/cart`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: Number(cartItem?.quantity) + 1,
          cartId: cartItem?._id,
        }),
      });
      const res = await response.json();

      if (res.message == "cart has been sucessfully updated") {
        toast.success(res.message);
        CheckIfProductAlreadyInCart();
      }
    } catch {}
  };
  const removeFromCart = async () => {
    toast("loading");
    try {
      const response = await fetch(`/api/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: cartItem?._id }),
      });
      const res = await response.json();
      console.log(res);

      if (res.message == "sucessfully deleted from cart") {
        toast.success(res.message);
        // const checkoutDetails: iCheckoutDetails = {
        //   cartId: String(cartItem?._id),
        //   price: Number(product?.price) * Number(cartItem?.quantity),
        // };
        CheckIfProductAlreadyInCart();
      }
    } catch {}
  };
  const AddProductToCart = async () => {
    setIsloading(true);
    const productId = product._id;

    try {
      const response = await fetch("/api/cart", {
        body: JSON.stringify({
          productId: productId,
          quantity: "1",
          userId: snap.user?._id,
          title: product.title,
        }),
        method: "POST",
      });
      const products = await response.json();
      if (products) {
        const getCart = async () => {
          try {
            const response = await fetch("/api/cart");
            const cart: Array<iCart> = await response.json();
            const totalQuantity = cart.reduce(
              (total, item) => total + Number(item.quantity),
              0
            );
            state.cartNumber = totalQuantity;
          } catch (error) {
            console.error("cart is empty");
          }
        };
        await getCart();
        setAlreadyInCart(true);
        CheckIfProductAlreadyInCart();
        toast.success("Item has been successfully added to cart");
      }
    } catch {
      toast.error("there was an error adding to cart");
    } finally {
      setIsloading(false);
    }
  };

  const CheckIfProductAlreadyInCart = async () => {
    try {
      const response = await fetch("/api/checkIfProductAlreadyInCart", {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
          userId: snap.user?._id,
        }),
      });
      const res = await response.json();
      if (res.message === "This Item has not been added to cart") {
        setAlreadyInCart(false);
      } else if (res.message === "This Item has already been added to cart") {
        setAlreadyInCart(true);
        setCartItem(res.cartItem);
      }
    } catch (error) {
      console.error("Error checking cart status", error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (snap.user?._id) {
      CheckIfProductAlreadyInCart();
    } else {
      setIsloading(false);
    }
  }, [snap.user?._id]);

  return (
    <div className="bg-white drop-shadow-md p-3 rounded-md md:flex flex-col gap-0.5 cursor-pointer">
      <Link href={`/item/${product._id}`}>
        <Image
          alt={product.title}
          loading="lazy"
          width={200}
          height={200}
          src={product.images.length ? product.images[0].url : ""}
          className="w-32 w-[calc(50vw-52px)] md:w-60 h-32 md:h-60 bg-white drop-shadow-lg m-0 rounded-md object-cover"
        />
      </Link>

      <Link href={`/item/${product._id}`}>
        <p className="font-bold text-purple-800 mt-2 text-xs sm:text-sm md:text-md hover:text-purple-800 break-words w-32 md:hidden h-8">
          {product.title.length > 28
            ? product.title.slice(0, 30) + "..."
            : product.title}
        </p>
      </Link>

      <Link href={`/item/${product._id}`}>
        <p className="font-bold text-purple-800 mt-2 text-xs sm:text-sm md:text-md hover:text-purple-800 hidden md:flex break-words w-32 md:w-60 h-8">
          {product.title.length > 60
            ? product.title.slice(0, 60) + "..."
            : product.title}
        </p>
      </Link>

      {product.setDiscount ? (
        <div className="text-purple-800 mb-2">
          <p className="text-gray-600 line-through">₦{product.price}</p>
          <p> ₦{product.discount}</p>
        </div>
      ) : (
        <div className="text-purple-800 mb-2">
          <p>&nbsp; </p>
          <p>₦{product.price}</p>
        </div>
      )}

      {snap.user?.accountType === "admin" ? (
        <div
          className="relative flex flex-col justify-end"
          onClick={() => setShowEditMenu(!showEditMenu)}
          onMouseLeave={() => setShowEditMenu(false)}
        >
          <button className="bg-purple-900 hover:bg-purple-950 text-white w-full rounded-md px-4 py-2 text-sm">
            Edit Listing
          </button>
          {showEditMenu && (
            <div className="absolute text-purple-900 z-10 w-full bg-white drop-shadow-lg rounded-md p-2 flex flex-col gap-1 top-[-65px]">
              <button
                className="bg-white p-1 rounded-md hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditListingId(String(product._id));
                  setShowListingForm(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-white rounded-md p-1 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAreYouSure(true);
                  setDeleteListingId(String(product._id));
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full">
          {isLoading ? (
            <button
              disabled
              className="bg-gray-400 text-white w-full rounded-md px-4 py-2 h-10 text-sm"
            >
              Loading...
            </button>
          ) : alreadyInCart ? (
            <div className="text-white w-full rounded-md text-sm cursor-pointer flex items-center gap-2">
              <button
                onClick={() => reduceQuantity()}
                className="bg-purple-900 hover:bg-purple-950 rounded-md h-10 w-10 text-2xl flex items-center justify-center transition-colors"
              >
                <GoDash />
              </button>
              <button className="bg-purple-900 flex-1 rounded-md h-10 flex items-center justify-center font-semibold">
                <span className="sm:hidden">{cartItem?.quantity}</span>
                <span className="hidden sm:block">
                  Quantity: {cartItem?.quantity}
                </span>
              </button>
              <button
                onClick={() => increaseQuantity()}
                className="bg-purple-900 hover:bg-purple-950 rounded-md h-10 w-10 text-2xl flex items-center justify-center transition-colors"
              >
                <FaPlus />
              </button>
            </div>
          ) : (
            <button
              className="bg-purple-900 hover:bg-purple-950 text-white w-full rounded-md px-4 py-2 h-10 text-sm cursor-pointer"
              onClick={() => {
                if (snap.user?._id) {
                  AddProductToCart();
                } else {
                  toast.error("Please Login and try again");
                }
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsCard;
