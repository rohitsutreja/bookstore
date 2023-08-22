import { Typography,Divider, TextField,Button, Box,TableContainer,Table,TableHead,TableRow,TableCell,TableBody } from '@mui/material'
import {React,useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import { defaultFilter } from "../../constant/constant";
import bookService from '../../service/book.service';
import categoryService from '../../service/category.service';
import TablePagination from '@mui/material/TablePagination';
import ConfirmationDialog from '../../Components/ConfirmationDialog';
import { toast } from 'react-toastify';
import { RecordsPerPage } from '../../constant/constant';
import 'react-toastify/dist/ReactToastify.css';
import Shared from '../../utils/Shared';
import theme from '../../theme';
import './Book.css'

function Book() {
    const [filters, setFilters] = useState(defaultFilter);
    const navigate = useNavigate();
    const columns = [
      { id: "name", label: "Book Name", minWidth: 100 },
      { id: "price", label: "Price", minWidth: 100 },
      { id: "category", label: "Category", minWidth: 100 },
    ];
    const [bookRecords, setBookRecords] = useState({
      pageIndex: 0,
      pageSize: 10,
      totalPages: 1,
      items: [],
      totalItems: 0,
    });

    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
      getAllCategories();
    }, []);
  
    const getAllCategories = async () => {
      await categoryService.getAll().then((res) => {
        if (res) {
          setCategories(res);
        }
      });
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        if (filters.keyword === "") delete filters.keyword;
        searchAllBooks({ ...filters });
      }, 500);
      return () => clearTimeout(timer);
    }, [filters]);

    const searchAllBooks = (filters) => {
      bookService.getAll(filters).then((res) => {
        setBookRecords(res);
      });
    };

    const onConfirmDelete = () => {
      bookService
        .deleteBook(selectedId)
        .then((res) => {
          toast.success(Shared.messages.DELETE_SUCCESS);
          setOpen(false);
          setFilters({ ...filters, pageIndex: 1 });
        })
        .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
    };

  return (
    <>
        <Typography variant='h4' align='center' sx={{mb:'10px'}}>Book Page</Typography>
        <Divider variant='inset' className='divider' sx={{ backgroundColor: 'rgb(37, 99, 235)' ,width:'12%',height:'1px',m:'auto'}}/>
        <Box className="container2">
        <div className="search-bar">
            <TextField
                id='text'
                name='text'
                placeholder='Search...'
                variant='outlined'
                inputProps={{className:"small"}}
                onChange={(e)=>{
                  setFilters({...filters,keyword:e.target.value,pageIndex:1});
                }}
                />
            <Button
            variant="contained"
            sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.secondary.main,p:'8px'}}
            disableElevation
            onClick={() => navigate("/add-book")}
          >
            Add
          </Button>
        </div>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookRecords?.items?.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>
                    {categories.find((c) => c.id === row.categoryId)?.name}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="contained"
                      sx={{mx:'8px'}}
                      color="success"
                      disableElevation
                      onClick={() => {
                        navigate(`/EditBook/${row.id}`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      disableElevation
                      onClick={() => {
                        setOpen(true);
                        setSelectedId(row.id ?? 0);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!bookRecords.items.length && (
                <TableRow className="TableRow">
                  <TableCell colSpan={5} className="TableCell">
                    <Typography align="center" className="noDataText">
                      No Books
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={RecordsPerPage}
          component="div"
          count={bookRecords.totalItems}
          rowsPerPage={filters.pageSize || 0}
          page={filters.pageIndex - 1}
          onPageChange={(e, newPage) => {
            setFilters({ ...filters, pageIndex: newPage + 1 });
          }}
          onRowsPerPageChange={(e) => {
            setFilters({
              ...filters,
              pageIndex: 1,
              pageSize: Number(e.target.value),
            });
          }}
          sx={{my:'10px'}}
        />
        <ConfirmationDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => onConfirmDelete()}
          title="Delete book"
          description="Are you sure you want to delete this book?"
        />
        </Box>
    </>
  )
}

export default Book