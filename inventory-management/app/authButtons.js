// components/AuthButtons.js
import React, { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import { signIn, signUp, signOutUser, monitorAuthState } from '../auth';

const AuthButtons = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = monitorAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const email = prompt("Enter email:");
    const password = prompt("Enter password:");
    try {
      await signIn(email, password);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSignUp = async () => {
    const email = prompt("Enter email:");
    const password = prompt("Enter password:");
    try {
      await signUp(email, password);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box position="absolute" top={0} right={0} p={2}>
      {!user ? (
        <>
          <Button onClick={handleSignUp} color="primary">Sign Up</Button>
          <Button onClick={handleSignIn} color="primary">Sign In</Button>
        </>
      ) : (
        <Button onClick={handleSignOut} color="primary">Sign Out</Button>
      )}
    </Box>
  );
};

export default AuthButtons;
