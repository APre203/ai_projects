import React from 'react'
import { Box, Button, TextField, Typography, Modal, Dialog, DialogTitle,DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useState, useRef } from 'react'
import { Camera } from 'react-camera-pro';
import { Cancel } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'

const PantryCamera = ( {updateInventory}) => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false); setLoading(false);};
  const handleTakeImage = () => {
    const photo = camera.current.takePhoto() 
    setImage(photo)
    handleOpen()
  }

  const handleAdd = async () => {
    try {
      const response = await fetch("/api/imageRecognition", {
          method: "POST",
          body: JSON.stringify({
              messages:
                  [
                      {
                          role: "system",
                          content: [
                              {
                                  type: "text",
                                  text: "You are a item predictor that can predict an item I am holding in my hand in the image. Return only the name of the item that I am holding in the image. If I am not holding anything, then reply 'false' as an answer.",
                              },
                          ],
                      },
                      {
                          role: "user",
                          content: [
                              {
                                  type: "image_url",
                                  image_url: {
                                      url: image,
                                  },
                              },
                          ],
                      },
                  ],
          }),
          headers: {
              'Content-Type': 'application/json',
           }
      })
      
      const result = (await response.json()).data

      if (result !== "false") {
          const docRef = doc(collection(firestore, 'inventory'), result)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()){
            const {quantity} = docSnap.data()
            await setDoc(docRef, {quantity: quantity + 1})
            alert(`${result} quantity updated in your pantry list`);
          } else{
            await setDoc(docRef, {quantity: 1})
            alert(`${result} added to your pantry list`);
          }

          updateInventory();
      } else {
          alert(`This item can't be added to your pantry list`)
      }
  } catch (error) {
      console.log("There was an error")
      console.error(error)
      alert(error)
  } finally {
      setOpen(false);
      setLoading(false);
      setImage(null);
  }
};

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={2}>
      <Box display={'flex'} position={'relative'} width={400} height={300} justifyContent='center' alignItems='center'>
        <Camera ref={camera} facingMode='environment' aspectRatio={4 / 3} />
      </Box>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
        <Button size='medium' variant='contained' onClick={handleTakeImage}>Take photo</Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle> Photo Taken </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Review the Photo. Click "Add" to save the item or "Cancel" to discard.
          </DialogContentText>
          <img src={image} width={500} alt={'Taken photo'}/>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} startIcon={<Cancel />}>
                Cancel
            </Button>
            <Button type='submit' onClick={()=>{setLoading(true);handleAdd()}} variant="contained" color="primary" >
                {loading ? <CircularProgress color='inherit' size={24} /> : 'Add'}
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PantryCamera
