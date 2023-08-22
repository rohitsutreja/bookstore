import { Typography,Divider, TextField,Button} from '@mui/material'
import {React,useState,useEffect} from 'react'
import {useNavigate,useParams} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Shared from '../../../utils/Shared';
import * as Yup from 'yup';
import { Formik } from "formik";
// import { useAuthContext } from '../../../context/auth';
import './EditCategory.css';
import categoryService from '../../../service/category.service';

function EditUser() {
//   const authContext = useAuthContext();
  const navigate = useNavigate();
  const initialValues = {
    name:"",
  };
  const [initialValueState,setInitialValueState] = useState(initialValues);
  const {id} = useParams();

  useEffect(()=>{
    if(id) getCategoryById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id])

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category Name is required"),
  });

  const getCategoryById = () => {
    categoryService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
      });
    });
  };

  const onSubmit = (values) => {
    categoryService
      .save(values)
      .then((res) => {
        toast.success(Shared.messages.UPDATED_SUCCESS);
        navigate("/category");
      })
      .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };
  return (
    <>
    <Typography variant='h4' align='center' sx={{mb:'10px'}}>{id ? "Edit" : "Add"} Category</Typography>
    <Divider variant='inset' className='divider' sx={{ backgroundColor: 'rgb(37, 99, 235)' ,width:'12%',height:'1px',m:'auto'}}/>
    <Formik
            initialValues={initialValueState}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={onSubmit}
        >
        {({
            values,errors,touched,handleBlur,handleSubmit,handleChange
        })=>(
            <form onSubmit={handleSubmit}>
                <div className='form-container'>
                    <div className='form-wrapper'>
                    <div className='form-col'>
                    <TextField
                        id="name"
                        name='name'
                        label="Category Name*"
                        variant='outlined'
                        inputProps={{className:"small"}}
                        value={values.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        />
                    </div>   
                </div>
                <div className='btn-wrapper'>
                <Button
                  sx={{p:'8px',m:'10px'}}
                  variant="contained"
                  type="submit"
                  color="success"
                  disableElevation
                  >
                  Save
                </Button>
                <Button
                  sx={{p:'8px'}}
                  variant="contained"
                  type="button"
                  color="error"
                  disableElevation
                  onClick={() => {
                      navigate("/category");
                    }}
                    >
                  Cancel
                </Button>
                </div>
                </div>
            </form>
        )}
        </Formik>
    </>
  )
}

export default EditUser