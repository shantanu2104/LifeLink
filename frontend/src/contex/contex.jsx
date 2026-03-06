import { createContext, useState } from "react";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};