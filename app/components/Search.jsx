"use client"
import {React, useState} from 'react'
import { TextField } from '@mui/material'

const Search = (props) => {
    const [query, setQuery] = useState('');
    const onSearch = props.setSearch
    const handleSearch = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
    <TextField value={query} onChange={handleSearch} id="outlined-search" fullWidth label="Search field" type="search" />
  )
}

export default Search