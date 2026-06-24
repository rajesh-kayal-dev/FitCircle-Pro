import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Star, ShoppingCart, Zap, ArrowLeft, ShieldCheck, Truck, RotateCcw, ChevronRight, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getProductById } from "../api/endpoints";
import { cn } from "../app/components/ui";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { CartDrawer } from "./store/CartDrawer";
import { CheckoutModal } from "./store/CheckoutModal";
import { PaymentModal } from "./store/PaymentModal";
import { OrderSuccessModal } from "./store/OrderSuccessModal";

export default function ProductDetails() {
  const { slug } = useParams(); // slug is actually the barcode/id from API
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFlavour, setSelectedFlavour] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Store flow modal state
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [address, setAddress] = useState(null);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await getProductById(slug);
        if (data.success && data.food) {
          const fetchedProduct = {
            id: data.food.id,
            slug: data.food.id,
            name: data.food.name,
            brand: data.food.brand,
            description: data.food.description,
            image: data.food.image || "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=300",
            price: Math.floor(Math.random() * 2000) + 500, // Dummy price
            category: "Supplement",
            rating: 4.5,
            reviews: 128,
            flavours: ["Unflavoured"],
            weights: ["100g", "250g", "500g"],
          };
          setProduct(fetchedProduct);
          setSelectedImage(fetchedProduct.image);
          setSelectedFlavour(fetchedProduct.flavours[0]);
          setSelectedWeight(fetchedProduct.weights[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold text-slate-500 animate-pulse">Loading Product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-black text-brand-text mb-4">Product Not Found</h2>
        <Link to="/products" className="text-brand-orange font-bold hover:underline">Back to Store</Link>
      </div>
    );
  }

  const relatedProducts = [];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`Added ${quantity} × ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setCartOpen(true);
  };

  // Checkout flow handlers
  const handleCheckout = () => { setCartOpen(false); setCheckoutOpen(true); };
  const handleAddressDone = (addr) => { setAddress(addr); setCheckoutOpen(false); setPaymentOpen(true); };
  const handleOrderSuccess = (id) => { setPaymentOpen(false); setOrderId(id); setSuccessOpen(true); };
  const handleSuccessClose = () => { setSuccessOpen(false); setOrderId(""); };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-sm font-bold text-brand-muted">
          <Link to="/products" className="hover:text-brand-orange transition-colors flex items-center gap-1">
            <ArrowLeft size={16} />
            Store
          </Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-brand-text truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Cart icon */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setCartOpen(true)}
            className="relative px-4 py-2.5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 hover:border-brand-orange hover:shadow-md transition-all group shadow-sm"
          >
            <ShoppingCart size={20} className="text-brand-text group-hover:text-brand-orange transition-colors" />
            <span className="text-sm font-bold text-brand-text">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-orange text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-md border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* ── LEFT: Images ── */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-white rounded-3xl border border-gray-100 p-8 flex items-center justify-center overflow-hidden shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </AnimatePresence>
            </motion.div>

            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {(product.thumbnails || [product.image]).map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(thumb)}
                  className={cn(
                    "w-18 h-18 rounded-xl border-2 transition-all p-2 bg-white flex-shrink-0",
                    selectedImage === thumb ? "border-brand-orange shadow-md scale-105" : "border-gray-100 hover:border-gray-300"
                  )}
                >
                  <img src={thumb} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="flex flex-col">
            <div className="mb-5">
              <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-wider rounded-lg mb-3 inline-block">
                {product.category}
              </span>
              <h1 className="text-3xl font-black text-brand-text tracking-tight mb-3 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-3 py-1 rounded-full border border-yellow-400/20">
                  <Star size={15} className="fill-yellow-600" />
                  <span className="text-sm font-black">{product.rating}</span>
                </div>
                <span className="text-brand-muted text-sm font-bold">{product.reviews} reviews</span>
              </div>
            </div>

            <p className="text-brand-muted font-medium mb-6 leading-relaxed text-sm">
              {product.description}
            </p>

            <div className="mb-6">
              <div className="text-3xl font-black text-brand-text tracking-tighter">₹{product.price.toLocaleString()}</div>
              <p className="text-xs font-bold text-brand-green mt-1">Inclusive of all taxes</p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Flavour */}
              {product.flavours?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-brand-text uppercase tracking-wider mb-3">Flavour</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.flavours.map(f => (
                      <button
                        key={f}
                        onClick={() => setSelectedFlavour(f)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                          selectedFlavour === f
                            ? "bg-brand-text text-white border-brand-text shadow-md"
                            : "bg-white text-brand-muted border-gray-100 hover:border-gray-300"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Weight */}
              {product.weights?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-brand-text uppercase tracking-wider mb-3">Weight</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.weights.map(w => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                          selectedWeight === w
                            ? "bg-brand-text text-white border-brand-text shadow-md"
                            : "bg-white text-brand-muted border-gray-100 hover:border-gray-300"
                        )}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h4 className="text-xs font-black text-brand-text uppercase tracking-wider mb-3">Quantity</h4>
                <div className="flex items-center bg-white border border-gray-100 w-fit rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-brand-muted hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-black text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-brand-muted hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons (also at bottom) */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-brand-text text-brand-text rounded-xl font-black hover:bg-gray-50 transition-all active:scale-95 text-sm"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 py-3.5 bg-brand-orange text-white rounded-xl font-black hover:bg-brand-text transition-all shadow-lg shadow-brand-orange/20 active:scale-95 text-sm"
              >
                <Zap size={18} />
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Truck size={18} className="text-brand-orange" />
                <span className="text-[10px] font-black uppercase text-brand-muted tracking-tight">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 border-x border-gray-100">
                <ShieldCheck size={18} className="text-brand-orange" />
                <span className="text-[10px] font-black uppercase text-brand-muted tracking-tight">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <RotateCcw size={18} className="text-brand-orange" />
                <span className="text-[10px] font-black uppercase text-brand-muted tracking-tight">7 Days Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-brand-text tracking-tight">Related Products</h2>
              <Link to="/products" className="text-sm font-bold text-brand-orange hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map(rel => (
                <motion.div
                  key={rel.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:shadow-xl transition-all group"
                >
                  <Link to={`/product/${rel.slug}`} className="block aspect-square mb-4 bg-gray-50 rounded-2xl overflow-hidden p-4">
                    <img src={rel.image} alt={rel.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                  </Link>
                  <div className="px-1">
                    <h4 className="font-black text-sm text-brand-text mb-1 truncate">{rel.name}</h4>
                    <div className="text-lg font-black text-brand-text">₹{rel.price.toLocaleString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Store Flow Modals */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onContinue={handleAddressDone} />
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} address={address} onSuccess={handleOrderSuccess} />
      <OrderSuccessModal open={successOpen} orderId={orderId} onClose={handleSuccessClose} />
    </>
  );
}
