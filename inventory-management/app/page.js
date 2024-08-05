'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { CssBaseline, Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import AuthButtons from './authButtons';
import useAuth from './useAuth';


export default function Home() {
  const [ inventory, setInventory ] = useState([]);
  const [ open, setOpen ] = useState(false);
  const [ itemName, setItemName ] = useState("");
  const { user, loading } = useAuth();
  const userID = user?.uid;

  const updateInventory = async (userID) => {
    if (!userID) return;  // Do nothing if no user is logged in
    const userInventory = query(collection(firestore, `users/${userID}/inventory`));
    const docs = await getDocs(userInventory);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  }
  
  useEffect(() => {
    updateInventory(userID);
  }, [])

  const addItem = async (item, userID) => {
    if (!userID) return; // Guard clause to handle unauthenticated users
  
    const itemRef = doc(collection(firestore, `users/${userID}/inventory`), item);
  
    try {
      const itemSnapshot = await getDoc(itemRef);
      if (itemSnapshot.exists()) {
        // If item exists, update its quantity
        await setDoc(itemRef, { quantity: itemSnapshot.data().quantity + 1 }, { merge: true });
      } else {
        // If item doesn't exist, create it with quantity 1
        await setDoc(itemRef, { quantity: 1 });
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  
    updateInventory(userID); // Update local state to reflect changes
  };
  
  const removeItem = async (item, userID) => {
    if (!userID) return;
    const docRef = doc(collection(firestore, `users/${userID}/inventory`), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory(userID);
  }


  useEffect(() => {
    if (user) {
      updateInventory(user.uid);
    } else {
      setInventory([]);  // Clear inventory when there is no user
    }
  }, [user]);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Box width="100vw" height="100vh" display="flex" justifyContent="center" flexDirection="column" alignItems="center" gap={2}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <AuthButtons />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{transform: 'translate(-50%, -50%)'}}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)}/>
            <Button variant="outlined" onClick={() => {
                addItem(itemName, userID)
                setItemName("")
                handleClose()
              }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h2" color="#333" textAlign="center">
              Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => addItem(name, userID)}>
                Add
              </Button>
              <Button variant="contained" onClick={() => removeItem(name, userID)}>
                Remove
              </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
