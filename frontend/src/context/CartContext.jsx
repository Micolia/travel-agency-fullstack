import { createContext, useState } from 'react'

export const CartContext = createContext()

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // add to cart
  const addToCart = (packageItem, bookingDetails) => {
    const newBooking = {
      id: Date.now(), // temporary id
      packageId: packageItem.id,
      packageTitle: packageItem.title,
      packageImage: packageItem.image,
      destination: packageItem.destination,
      price: packageItem.price,
      bookingDetails: {
        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
        passengers: bookingDetails.passengers,
        totalPrice: packageItem.price * bookingDetails.passengers
      },
      addedAt: new Date().toISOString()
    }

    setCartItems(prev => [...prev, newBooking])
    setIsCartOpen(true) // open cart when adding something
  }

  // Remove booking from cart
  const removeFromCart = (bookingId) => {
    setCartItems(prev => prev.filter(item => item.id !== bookingId))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Calculate total cart
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.bookingDetails.totalPrice, 0)
  }

  // Get number of items in cart
  const getCartItemsCount = () => {
    return cartItems.length
  }

  // Toggle cart open/close
  const toggleCart = () => {
    setIsCartOpen(prev => !prev)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getCartItemsCount,
      isCartOpen,
      setIsCartOpen,
      toggleCart
    }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
