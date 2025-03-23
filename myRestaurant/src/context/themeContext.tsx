// contexts/AppContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react"; // Importez votre schéma de couleurs
import { Colors } from "../const/colors";
import { storage } from "../const/storage";

type AppContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof Colors.dark;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState(0);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const updateCart = (items: number) => setCartItems(items);

  const colors = useMemo(
    () => (isDarkMode ? Colors.dark : Colors.light),
    [isDarkMode]
  );

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = storage.getString("theme");
      if (savedTheme) setIsDarkMode(savedTheme === "dark");
    };
    loadTheme();
  }, []);

  useEffect(() => {
    storage.set("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const value = {
    isDarkMode,
    toggleTheme,
    colors,
    cartItems,
    updateCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
