import { Typography,Divider, TextField,Button, Box,TableContainer,Table,TableHead,TableRow,TableCell,TableBody } from '@mui/material'
import {React,useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import { defaultFilter } from "../../constant/constant";
import TablePagination from '@mui/material/TablePagination';
import ConfirmationDialog from '../../Components/ConfirmationDialog';
import { toast } from 'react-toastify';
import { RecordsPerPage } from '../../constant/constant';
import 'react-toastify/dist/ReactToastify.css';
import Shared from '../../utils/Shared';
import categoryService from '../../service/category.service';
import { useAuthContext } from '../../context/auth';
import './Category.css';
import { RoutePaths } from '../../utils/enum';

function Category() {
  const [filters, setFilters] = useState(defaultFilter);
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const [categoryRecords, setcategoryRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const columns = [
    {id:"name",label:"Category Name",minWidth:100},
  ] 
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllCategories({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllCategories = (filters) => {
    categoryService.getAll(filters).then((res) => {
      if(res) setcategoryRecords(res);
    });
  };

  const onConfirmDelete = async () => {
    await categoryService.deleteCategory(selectedId).then((res)=>{
      if(res){
        console.log(res);
        toast.success(Shared.messages.DELETE_SUCCESS);
        setOpen(false);
        setFilters({...filters});
      }
    }).catch((e)=>{
      console.log(e);
      toast.error(Shared.messages.DELETE_FAIL)
    });
  }
  return (
    <>
    <Typography variant='h4' align='center' sx={{mb:'10px'}}>Category</Typography>
        <Divider variant='inset' className='divider' sx={{ backgroundColor: 'rgb(37, 99, 235)' ,width:'12%',height:'1px',m:'auto'}}/>
        <Box className="con">
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
                type="button"
                variant="contained"
                color="info"
                disableElevation
                onClick={() => {
                    navigate(RoutePaths.AddCategory)
                }}
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
              {categoryRecords?.items?.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="contained"
                      sx={{mx:'8px'}}
                      color="success"
                      disableElevation
                      onClick={() => {
                        navigate(`/edit-category/${row.id}`);
                      }}
                    >
                      Edit
                    </Button>
                    {row.id !== authContext.user.id &&(
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
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!categoryRecords.items.length && (
                <TableRow className="TableRow">
                  <TableCell colSpan={5} className="TableCell">
                    <Typography align="center" className="noDataText">
                      No Category
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
          count={categoryRecords.totalItems}
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
          title="Delete category"
          description="Are you sure you want to delete this category?"
        />
        </Box>
    </>
  )
}

export default Category;