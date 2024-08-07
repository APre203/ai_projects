import React from 'react'
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Inventory } from '@mui/icons-material';
import { firestore } from '@/firebase'
import {
    collection,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
  } from 'firebase/firestore'


function createData(name, quantity) {
    return {
      name,
      quantity,
    };
  }
  

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Item Name',
    },
    {
      id: 'quantity',
      numeric: true,
      disablePadding: false,
      label: 'Quantity',
    },
    // {
    //   id: 'actions',
    //   numeric: true,
    //   disablePadding: false,
    //   label: 'Actions',
    // },
  ];
  
  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  
  function EnhancedTableToolbar(props) {
    const { numSelected,removeAllItems } = props;
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Pantry Manager
          </Typography>
        )}
  
        {numSelected > 0 ? (
            <Box display={'flex'} >
          <Tooltip title="Edit">
            <IconButton onClick={() =>{console.log("CLICKED EDIT")}}>
                <ModeEditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={removeAllItems}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
            </Box>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }
  
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    removeAllItems: PropTypes.func.isRequired
  };
  
  
  

const TableComponent = ({ rows, updateInventory}) => {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
    if (event.target.checked) {
        const newSelected = rows.map((n) => n.name);
        setSelected(newSelected);
        return;
    }
    setSelected([]);
    };

    const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
        );
    }
    setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    };


    const isSelected = (name) => { 
        return selected.indexOf(name) !== -1};

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
    () =>
        stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
        ),
    [order, orderBy, page, rowsPerPage, rows],
    );

    // const removeAllItems = async (items) => {
    //     const docRef = doc(collection(firestore, 'inventory'), item)
    //     const docSnap = await getDoc(docRef)
    //     if (docSnap.exists()) {
    //       const { quantity } = docSnap.data()
    //       if (quantity === 1) {
    //         await deleteDoc(docRef)
    //       } else {
    //         await setDoc(docRef, { quantity: quantity - 1 })
    //       }
    //     }
    //     await updateInventory()
    //   }

    const removeAllItems = async () => {
        for (let item of selected){
            const docRef = doc(collection(firestore, 'inventory'), item)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
              await deleteDoc(docRef)
            }
        }
        setSelected([])
        await updateInventory()
      }

    return (
    <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} removeAllItems={removeAllItems} />
        <TableContainer>
            <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
            >
            <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
            />
            <TableBody>
                {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                    <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                    >
                    <TableCell padding="checkbox">
                        <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        />
                    </TableCell>
                    <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                    >
                        {row.name}
                    </TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    {/* <TableCell align="right">EDIT HERE</TableCell> */}
                    {/* <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell> */}
                    </TableRow>
                );
                })}
                {emptyRows > 0 && (
                <TableRow
                    style={{
                    height: (53) * emptyRows,
                    }}
                >
                    <TableCell colSpan={6} />
                </TableRow>
                )}
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Paper>
    </Box>
    );
}

export default TableComponent


