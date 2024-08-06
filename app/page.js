'use client'

import { useState, useEffect } from 'react'
import { Box, Container, Tab } from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab';
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import Search from './components/Search'
import PantryForm from './components/PantryForm'
import TableComponent from './components/TableComponent'
import PantryCamera from './components/PantryCamera';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFiltered(inventoryList)
  }

  // const handleTabChange = (newValue) => {
  //   setTabValue(newValue + '');
  // };
  
  
  
  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() =>{
    if (search != ''){
      const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filtered)
    }else{
      setFiltered(inventory)
    }
  }, [search, inventory])

  return (
    <Container>
      <Search setSearch={setSearch} />
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} > {/* */}
              <Tab label="Add Manually" value="1" />
              <Tab label="Use Camera" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <PantryForm updateInventory={updateInventory}/>
          </TabPanel>
          <TabPanel value="2">
            <PantryCamera updateInventory={updateInventory}/>
          </TabPanel>
        </TabContext>
      </Box>
      
      <Box border={'1px solid #333'}>
        <TableComponent rows={filtered} updateInventory={updateInventory} />
        {/* <Stack height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              minHeight="150px"
              display={'grid'}
              gridAutoFlow={'column'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Grid item xs={6}>
                <Typography  color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography  color={'#333'} textAlign={'center'}>
                  {quantity}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Grid>
            </Box>
          ))}
        </Stack> */}
      </Box>
    </Container>
  )
}