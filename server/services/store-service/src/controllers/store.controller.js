import prisma from "../config/prismaClient.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, name, price, quantity } = req.body;
    const userId = req.user.id;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: {
            create: {
              productId,
              name,
              price: parseFloat(price),
              quantity: parseInt(quantity),
            },
          },
        },
        include: { items: true },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity),
        },
      });
      // Re-fetch cart with updated items
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });
    }

    res.json({ message: "Added to cart ✅", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: true },
    });
    res.json(cart || { userId: req.user.id, items: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart empty ❌" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        items: cart.items, // Items will be stored as JSON
        totalAmount,
      },
    });

    // clear cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.json({ message: "Order placed ✅", order });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};