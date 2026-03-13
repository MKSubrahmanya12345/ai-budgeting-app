import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import api from "../lib/api";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Sync Firebase user with our MongoDB backend
  const syncWithBackend = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      const idToken = await firebaseUser.getIdToken();
      // Use the firebase endpoint to ensure user exists in MongoDB and get their profile
      const { data } = await api.post("/api/auth/firebase", { idToken });
      setUser(data.user);
    } catch (error) {
      console.error("Backend sync failed:", error);
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginWithFirebase = async (email, password, isRegister = false, extraData = {}) => {
    setIsAuthLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        // Note: the observer onAuthStateChanged will handle the syncWithBackend
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setIsAuthLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setIsAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setIsAuthLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      setUser(null);
    }
  };

  const updateNetBalance = async (netBalance, cashBalance, savingsBalance) => {
    await api.patch('/api/auth/net-balance', { netBalance, cashBalance, savingsBalance });
    // Re-sync to get updated data
    if (auth.currentUser) await syncWithBackend(auth.currentUser);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      syncWithBackend(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      loginWithFirebase,
      loginWithGoogle,
      logout,
      updateNetBalance,
      setUser,
    }),
    [user, isAuthLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
