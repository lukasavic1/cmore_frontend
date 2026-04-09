/**
 * date: 9.4.2026.
 * owner: lukasavic18@gmail.com
 *
 * Stores auth session state and exposes login/logout actions to the
 * component tree.
 */

import { createContext, useCallback, useEffect, useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import {
  googleSignIn as apiGoogleSignIn,
  getMe,
  logout as apiLogout,
} from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("auth_token")),
  );

  // On mount: restore session from localStorage by verifying with the API
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    getMe()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem("auth_token"))
      .finally(() => setLoading(false));
  }, []);

  // Shared helper: exchange any Firebase ID token for a Sanctum token
  async function exchangeToken(firebaseUser) {
    const firebaseToken = await firebaseUser.getIdToken();
    const data = await apiGoogleSignIn(firebaseToken);
    localStorage.setItem("auth_token", data.token);
    setUser(data.user);
  }

  const signInWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await exchangeToken(result.user);
  }, []);

  // Keep old name as alias so LandingPage doesn't need changes yet
  const signIn = signInWithGoogle;

  const signInWithEmail = useCallback(async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await exchangeToken(result.user);
  }, []);

  const signUpWithEmail = useCallback(async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Set the display name so the backend gets it in the token profile
    await updateProfile(result.user, { displayName: name });
    // Force-refresh so the new displayName is included in the ID token
    await result.user.getIdToken(true);
    await exchangeToken(result.user);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await Promise.all([apiLogout(), firebaseSignOut(auth)]);
    } catch {
      // Swallow errors — token may already be expired
    }
    localStorage.removeItem("auth_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
