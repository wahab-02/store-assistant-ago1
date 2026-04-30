import { createContext, useContext, useState } from "react";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bestBeforeDate, setBestBeforeDate] = useState(null);

  const setProduct = (product) => {
    setCurrentProduct(product);
    setError(null);
  };

  const clearProduct = () => {
    setCurrentProduct(null);
    setError(null);
    setLoading(false);
    setBestBeforeDate(null);
  };

  return (
    <ProductContext.Provider
      value={{
        currentProduct,
        loading,
        error,
        bestBeforeDate,
        setProduct,
        setLoading,
        setError,
        setBestBeforeDate,
        clearProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within ProductProvider");
  }
  return context;
}
