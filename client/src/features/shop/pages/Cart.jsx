import { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { assets } from "../../../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
  } = useAppContext();
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      // Parse cart key to extract productId and weight
      const [productId, weight] = key.includes('-') ? key.split('-') : [key, ''];

      const product = products.find((item) => item._id === productId);
      if (product) {
        let itemPrice = product.price;
        let itemOfferPrice = product.offerPrice;

        // Check for weight variant pricing
        if (weight && product.weightVariants && product.weightVariants.length > 0) {
          const variant = product.weightVariants.find((v) => v.weight === weight);
          if (variant) {
            itemPrice = variant.price;
            itemOfferPrice = variant.offerPrice;
          }
        }

        const cartItem = {
          ...product,
          price: itemPrice,
          offerPrice: itemOfferPrice,
          quantity: cartItems[key],
          selectedWeight: weight,
          cartKey: key // Store the full cart key for updates/removals
        };
        tempArray.push(cartItem);
      }
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (Array.isArray(data.addresses) && data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            weight: item.selectedWeight || "",
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post("/api/order/stripe", {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            weight: item.selectedWeight || "",
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          window.location.replace(data.url);
          setCartItems({});
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  if (products.length === 0 || !cartItems || Object.keys(cartItems).length === 0 || getCartCount() === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <img src={assets.cart_icon} alt="Empty Cart" className="w-12 h-12 opacity-40" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Explore our products and find something you like!
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dull transition-transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 mb-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-baseline gap-4">
        Shopping Cart
        <span className="text-base font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {getCartCount()} {getCartCount() === 1 ? 'Item' : 'Items'}
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Product List */}
        <div className="flex-1 w-full lg:w-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_auto] gap-4 p-5 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
            <p>Product</p>
            <p className="text-center">Quantity</p>
            <p className="text-center">Total</p>
            <p className="sr-only">Actions</p>
          </div>
          <div className="divide-y divide-gray-100">
            {cartArray.map((product, index) => (
              <div key={index} className="p-5 flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr_auto] gap-6 items-center hover:bg-gray-50/50 transition-colors">
                {/* Product Info */}
                <div className="flex items-center gap-5 w-full">
                  <div
                    onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product._id}`)}
                    className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border border-gray-200"
                  >
                    <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{product.name}</h3>
                    {product.selectedWeight && (
                      <p className="text-sm text-emerald-600 font-medium mb-2">Weight: {product.selectedWeight}</p>
                    )}
                    <p className="text-primary font-bold md:hidden">{currency}{product.offerPrice}</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => {
                      const newQty = cartItems[product.cartKey] - 1;
                      if (newQty <= 0) {
                        removeFromCart(product._id, product.selectedWeight);
                      } else {
                        updateCartItem(product._id, newQty, product.selectedWeight);
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded shadow-sm transition-all font-bold"
                  >-</button>
                  <input
                    type="number"
                    min="1"
                    value={cartItems[product.cartKey]}
                    readOnly
                    className="w-10 text-center bg-transparent font-medium bg-none outline-none"
                  />
                  <button
                    onClick={() => updateCartItem(product._id, cartItems[product.cartKey] + 1, product.selectedWeight)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded shadow-sm transition-all font-bold"
                  >+</button>
                </div>

                {/* Total */}
                <p className="hidden md:block text-center font-bold text-gray-800 text-lg">
                  {currency}{(product.offerPrice * product.quantity).toLocaleString()}
                </p>


              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[380px] flex-shrink-0 lg:sticky lg:top-24">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

            <div className="space-y-6">
              {/* Address Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 relative group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Delivery Address</h3>
                  <button onClick={() => setShowAddress(!showAddress)} className="text-primary text-sm font-medium hover:text-primary-dull transition-colors">
                    {showAddress ? "Done" : "Change"}
                  </button>
                </div>

                <div className="text-gray-600 text-sm leading-relaxed pr-2">
                  {selectedAddress ? (
                    <>
                      <p className="font-medium text-gray-800">{selectedAddress.firstname} {selectedAddress.lastname}</p>
                      <p>{selectedAddress.street}</p>
                      <p>{selectedAddress.city}, {selectedAddress.state}</p>
                      <p>{selectedAddress.zipcode}, {selectedAddress.country}</p>
                    </>
                  ) : (
                    <p className="text-orange-500 flex items-center gap-2"><span className="text-lg">⚠️</span> Please select an address</p>
                  )}
                </div>

                {/* Address Dropdown */}
                {showAddress && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden text-sm animate-in fade-in slide-in-from-top-2">
                    <div className="max-h-64 overflow-y-auto no-scrollbar">
                      {addresses.map((addr) => (
                        <div key={addr._id} className="p-3 hover:bg-gray-50 border-b border-gray-50 transition-colors cursor-pointer relative group/item">
                          <div onClick={() => { setSelectedAddress(addr); setShowAddress(false); }}>
                            <p className="font-medium text-gray-800">{addr.firstname} {addr.lastname}</p>
                            <p className="text-gray-500 truncate">{addr.street}, {addr.city}...</p>
                          </div>
                          <div className="flex gap-2 mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity justify-end">
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate("/add-address", { state: { address: addr } }); }}
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 font-medium"
                            >Edit</button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm("Delete this address?")) {
                                  try {
                                    const { data } = await axios.delete(`/api/address/delete/${addr._id}`);
                                    if (data.success) { toast.success(data.message); if (selectedAddress?._id === addr._id) setSelectedAddress(null); getUserAddress(); }
                                    else { toast.error(data.message); }
                                  } catch (err) { toast.error(err.message); }
                                }
                              }}
                              className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100 font-medium"
                            >Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => navigate("/add-address")} className="w-full p-3 text-center text-primary font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <span>+</span> Add New Address
                    </button>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div>
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentOption("COD")}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${paymentOption === "COD" ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    Cash On Delivery
                  </button>
                  <button
                    onClick={() => setPaymentOption("Online")}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${paymentOption === "Online" ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    Online Payment
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{currency}{getCartAmount().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (2%)</span>
                  <span>{currency}{((getCartAmount() * 2) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>{currency}{(getCartAmount() * 1.02).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-md"
              >
                {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Secure Checkout • Free Returns • 24/7 Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
