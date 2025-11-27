import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";

export const AppProvider = ({ children }) => (
  <AuthProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </AuthProvider>
);