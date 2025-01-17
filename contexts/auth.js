"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/init";

const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if(user) setUser(currentUser);
      if(!user) setUser(null)
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  const value = { user, loading };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


export const useAuth = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AuthProvider;
