"use client"
import React, { useEffect } from 'react'
import { Stack, TextField, Button } from '@mui/material'
import { useState } from 'react'
import { firestore } from '@/firebase'
import {
    collection,
    doc,
    setDoc,
    getDoc,
  } from 'firebase/firestore'


const PantryForm = (props) => {

    const updateInventory = props.updateInventory

    const [itemName, setItemName] = useState('')
    const [itemQuantity, setItemQuantity] = useState('')
    

    const addItem = async () => {
        
        if (itemName && itemName != '' && Number(itemQuantity) > 0){
          const docRef = doc(collection(firestore, 'inventory'), itemName)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            await setDoc(docRef, { quantity: quantity + Number(itemQuantity) })
          } else {
            await setDoc(docRef, { quantity: Number(itemQuantity) })
          }
          await updateInventory()
        }
        setItemName('')
        setItemQuantity('')
      }
    
      const handleNewItem = (e) => {
        setItemName(e.target.value)
      }
      const handleNewQuantity = (e) => {
        setItemQuantity(e.target.value)
      }

    return (
        <Stack display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={2}>
          <TextField 
              id="outlined-basic" 
              label="Item" 
              variant="outlined" 
              defaultValue={''}
              value={'' || itemName}
              onChange={handleNewItem} 
              />
          <TextField
              id="outlined-number"
              label="Number"
              type="number"
              inputProps={{ min: 1 }}
              defaultValue={''}
              value={'' || itemQuantity}
              onChange={handleNewQuantity}
              />
          <Button variant="contained" onClick={addItem} fullWidth>
              Add New Item
          </Button>
        
        </Stack>
    )
}

export default PantryForm;