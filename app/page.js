"use client";

import { firestore } from "@/firebase";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { Firestore } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid black",
  boxShadow: 24,
  p: 4,
  color: "black",
  gap: 3,
  backgroundColor: "papayawhip",
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [itemName, setItemName] = useState("");

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, count: doc.data().count });
    });
    // console.log(pantryList);
    setPantry(pantryList);
    setFilteredPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPantry(pantry); // Show all items if search query is empty
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = pantry.filter((item) =>
        item.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredPantry(results); // Update state with filtered items
    }
  }, [searchQuery, pantry]);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(to right, #868f96 0%, #596164 100%)",
      }}
    >
      <Box
        width={"100%"}
        height={"100vh"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={2}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack
              direction={"row"}
              spacing={2}
              width={"100%"}
              bgcolor={"snow"}
            >
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "tomato",
                  "&:hover": {
                    backgroundColor: "salmon",
                  },
                }}
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button
          variant="container"
          sx={{
            backgroundColor: "tomato",
            "&:hover": {
              backgroundColor: "salmon",
            },
          }}
          onClick={handleOpen}
        >
          Add
        </Button>
        <TextField
          id="search-bar"
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            marginBottom: 2,
            width: "800px",
            backgroundColor: "papayawhip",
          }}
        />
        <Box border={"1px solid #333"}>
          <Box
            width={"800px"}
            height={"100px"}
            bgcolor={"tomato"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography variant="h2" color={"seashell"} textAlign={"center"}>
              {" "}
              Pantry Items
            </Typography>
          </Box>

          <Stack
            width={"800px"}
            height={"500px"}
            spacing={2}
            overflow={"auto"}
            bgcolor={"seashell"}
          >
            {filteredPantry.length === 0 ? (
              <Typography variant="h6" color="textSecondary" textAlign="center">
                Add a Item
              </Typography>
            ) : (
              filteredPantry.map((i) => (
                <Stack
                  key={i.name}
                  direction={"row"}
                  spacing={2}
                  justifyContent={"center"}
                  alignContent={"space-between"}
                  // bgcolor={"white"}
                >
                  <Box
                    width={"100%"}
                    minHeight={"200px"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    bgcolor={"salmon"}
                  >
                    <Typography
                      variant="h3"
                      color={"#333"}
                      textAlign={"center"}
                    >
                      {i.name.charAt(0).toUpperCase() + i.name.slice(1)}
                    </Typography>

                    <Typography
                      sx={{
                        color: "black",
                        marginLeft: 10,
                        fontSize: 30,
                      }}
                    >
                      Quantity: {i.count}
                    </Typography>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Button
                      variant="contained"
                      onClick={() => removeItem(i.name)}
                      sx={{
                        height: 60,
                        backgroundColor: "tomato",
                        "&:hover": {
                          backgroundColor: "salmon",
                        },
                      }}
                    >
                      Delete Item
                    </Button>
                  </Box>
                </Stack>
              ))
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
