"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/init";
import { set } from "firebase/database";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [ loading, setLoading ] = useState(true);

  const companies = {
    "-abc123": { companyName: "GT Remodling Inc", multiplier: 4 },
    "-def456": { companyName: "Laor Marketing Solutions GT", multiplier: 3 }
  }
  

  useEffect(() => {
    setLoading(true);
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      console.log(currentUser)
      if(user) setUser(currentUser);
      if(!user) setUser(null)
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);


  const value = { user, loading, companies };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppProvider;
