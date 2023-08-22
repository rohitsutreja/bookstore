import { Typography,Divider, TextField,Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import {React,useState,useEffect} from 'react'
import {useNavigate,useParams} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Shared from '../../../utils/Shared';
import * as Yup from 'yup';
import { Formik } from "formik";
import { useAuthContext } from '../../../context/auth';
import './EditUser.css';
import userService from '../../../service/user.service';

function EditUser() {
  const authContext = useAuthContext();
  const [roles,setRoles] = useState([]);
  const [user,setUser] = useState();
  const navigate = useNavigate();
  const initialValues = {
    id:0,
    email:"",
    lastName:"",
    firstName:"",
    roleId:3,
  };
  const [initialValueState,setInitialValueState] = useState(initialValues);
  const {id} = useParams();

  // const roleList = [
  //   { id: 1, name:"admin" },
  //   { id: 3, name: "buyer" },
  //   { id: 2, name: "seller" },
  // ];

  useEffect(()=>{
    getRoles();
  },[])
  useEffect(()=>{
    if(id) getUserById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id])

  useEffect(()=>{
    if(user && roles.length){
      const roleId = roles.find((role)=>role.name === user?.role)?.id;
      setInitialValueState({
        id:user.id,
        email:user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        roleId,
        password: user.password,
      })
    }
  },[user,roles]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    roleId: Yup.number().required('Role is required'),
  });

  const getRoles = () =>{
    userService.getAllRoles().then((res)=>{
      if(res) setRoles(res);
    })
  }
  const getUserById = () =>{
    userService.getById(Number(id)).then((res)=>{
      if(res){
        setUser(res);
      }
    })
  }
  const onSubmit = (values) =>{
    const updatedValue = {
      ...values,
      role: roles.find((r)=>r.id === values.roleId).name,
    }
    userService.update(updatedValue).then((res)=>{
      if(res){
        toast.success(Shared.messages.UPDATED_SUCCESS);
        console.log(res);
        navigate("/user");
      }
    }).catch((e)=> {
      console.log(e);
      toast.error(Shared.messages.UPDATED_FAIL)
    });
  }
  return (
    <>
    <Typography variant='h4' align='center' sx={{mb:'10px'}}>Edit User</Typography>
    <Divider variant='inset' className='divider' sx={{ backgroundColor: 'rgb(37, 99, 235)' ,width:'12%',height:'1px',m:'auto'}}/>
    <Formik
            initialValues={initialValueState}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={onSubmit}
        >
        {({
            values,errors,touched,handleBlur,handleChange,handleSubmit,setValues,setFieldError,setFieldValue,
        })=>(
            <form onSubmit={handleSubmit}>
                <div className='form-container'>
                    <div className='form-wrapper'>
                    <div className='form-col'>
                    <TextField
                        id="first-name"
                        name='firstName'
                        label="First Name*"
                        variant='outlined'
                        inputProps={{className:"small"}}
                        value={values.firstName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        />
                    </div>
                    <div className='form-col'>
                    <TextField
                        id="last-name"
                        name='lastName'
                        label="Last Name*"
                        variant='outlined'
                        inputProps={{className:"small"}}
                        value={values.lastName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        />
                    </div>
                    <div className='form-col'>
                    <TextField
                        id="email"
                        name='email'
                        label="Email*"
                        variant='outlined'
                        inputProps={{className:"small"}}
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        />
                    </div>
                    {values.id !== authContext.user.id &&(
                      <div className='form-col'>
                        <FormControl
                          className='dropdown-wrapper'
                          variant='outlined'
                          disabled={values.id === authContext.user.id}
                        >
                          <InputLabel htmlFor="select">Roles</InputLabel>
                          <Select
                            name="roleId"
                            id={"roleId"}
                            label="Roles"
                            onChange={handleChange}
                            disabled={values.id === authContext.user.id}
                            value={values.roleId}
                          >
                            {roles.length>0 && 
                              roles.map((role)=>(
                                <MenuItem value={role.id} key={"name"+ role.id}>
                                  {role.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>
                    )}    
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
                      navigate("/user");
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