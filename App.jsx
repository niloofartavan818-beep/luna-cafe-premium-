import React, { useMemo, useState } from "react";

import Header from "./components/layout/Header";
import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import MenuSection from "./components/menu/MenuSection";
import About from "./components/home/About";
import Gallery from "./components/home/Gallery";
import Contact from "./components/home/Contact";
import Footer from "./components/layout/Footer";

import CartDrawer from "./components/cart/CartDrawer";
import ReservationModal from "./components/reservation/ReservationModal";
import CheckoutModal from "./components/checkout/CheckoutModal";

import { menuItems } from "./data/menu";

export default function App() {
  const [cart, setCart] = useState([]);

  const [cartOpen, setCartOpen] = useState(false);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [reservationOpen, setReservationOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  // =========================
  // TOTAL
  // =========================

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [cart]);

  // =========================
  // COUNT
  // =========================

  const count = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );
  }, [cart]);

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (item) => {
    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return previousCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                qty: cartItem.qty + 1,
              }
            : cartItem
        );
      }

      return [
        ...previousCart,
        {
          ...item,
          qty: 1,
        },
      ];
    });

    setCartOpen(true);
  };

  // =========================
  // CHANGE QUANTITY
  // =========================

  const changeQty = (id, amount) => {
    setCart((previousCart) => {
      return previousCart
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          return {
            ...item,
            qty: item.qty + amount,
          };
        })
        .filter((item) => item.qty > 0);
    });
  };

  // =========================
  // SCROLL
  // =========================

  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    setMobileOpen(false);
  };

  // =========================
  // CHECKOUT
  // =========================

  const openCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
  };

  // =========================
  // ORDER SUCCESS
  // =========================

  const handleOrderSuccess = (orderData) => {
    console.log("LUNA ORDER:", {
      customer: orderData,
      items: cart,
      total,
    });
  };

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#30231b]">

      {/* HEADER */}

      <Header
        count={count}
        cartOpen={() => setCartOpen(true)}
        reservation={() => setReservationOpen(true)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        scrollTo={scrollTo}
      />

      {/* MAIN */}

      <main>

        <Hero
          scrollTo={scrollTo}
          reservation={() => setReservationOpen(true)}
        />

        <Features />

        <MenuSection
          items={menuItems}
          addToCart={addToCart}
        />

        <About />

        <Gallery />

        <Contact
          reservation={() => setReservationOpen(true)}
        />

      </main>

      {/* FOOTER */}

      <Footer />

      {/* CART */}

      <CartDrawer
        open={cartOpen}
        close={() => setCartOpen(false)}
        cart={cart}
        total={total}
        changeQty={changeQty}
        onCheckout={openCheckout}
      />

      {/* CHECKOUT */}

      <CheckoutModal
        open={checkoutOpen}
        close={closeCheckout}
        cart={cart}
        total={total}
        onSuccess={handleOrderSuccess}
      />

      {/* RESERVATION */}

      <ReservationModal
        open={reservationOpen}
        close={() => setReservationOpen(false)}
      />

    </div>
  );
}