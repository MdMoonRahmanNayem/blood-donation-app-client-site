/* eslint-disable */
import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../firebase/firebase.config";
import axios from "axios";

// =========================
// Context Create
// =========================
export const AuthContext = createContext(null);

const auth = getAuth(app);

// =========================
// Provider
// =========================
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // firebase user
  const [dbUser, setDbUser] = useState(null);  // mongodb user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const res = await axios.get(
            `http://localhost:5000/users/${currentUser.email}`
          );

          // 🛑 BLOCKED USER SAFETY (future use)
          if (res.data?.status === "blocked") {
            await signOut(auth);
            setUser(null);
            setDbUser(null);
          } else {
            setDbUser(res.data);
          }
        } catch (err) {
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setDbUser(null);
  };

  const authInfo = {
    user,       // firebase auth user
    dbUser,     // role + status user
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// ✅ Custom Hook (NO ERROR)
// =========================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
