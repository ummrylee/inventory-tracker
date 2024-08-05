import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

export const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);

export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

export const signOutUser = () => signOut(auth);

export const monitorAuthState = (setUser) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, set the user state
        setUser(user);
      } else {
        // User is signed out, set user state to null
        setUser(null);
      }
    });
  
    return unsubscribe; // This should return a function
  };