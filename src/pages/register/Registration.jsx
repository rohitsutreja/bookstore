import React from 'react';
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel,FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './Registration.css';
import theme from '../../theme';
import * as yup from 'yup';


const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  roleId: yup.number().oneOf([2, 3], 'Please select a valid role').required('Role is required'),
  password: yup.string().required('Password is required').min(5, 'Password must be at least 5 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});
const roleList = [
  { id: 3, name: "buyer" },
  { id: 2, name: "seller" },
];
const RegistrationForm = () => {
  const navigate = useNavigate();

  const onSubmit = (values) => {
    axios.post("https://book-e-sell-node-api.vercel.app/api/user",{
      firstName : values.firstName,
      lastName : values.lastName,
      email : values.email,
      roleId : values.roleId,
      password : values.password,
    }).then(response => {
      console.log(values.roleId);
      toast.success("Successfully Register!");
      navigate("/Login");
    })
    .catch(error => {
      toast.error("Error! try again");
    });
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      roleId: 0,
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
});

  return (
    <form onSubmit={formik.handleSubmit} className="form">
      <Grid className='grid'>
        <Grid className='contain'>
          <TextField
            className='field'
            id="firstName"
            name="firstName"
            label="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </Grid>
        <Grid className='contain'>
          <TextField
            className='field'
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Grid>
        <Grid className='contain'>
          <TextField
            className='field'
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
        <Grid className='contain'>
          <FormControl variant="outlined" className='field'>
            <InputLabel htmlFor="roleId">Role</InputLabel>
            <Select
              id={"roleId"}
              name="roleId"
              label="roleId"
              value={formik.values.roleId}
              onChange={formik.handleChange}
              error={formik.touched.roleId && Boolean(formik.errors.roleId)}
            >
            <MenuItem value="">Select Role</MenuItem>
            {roleList.length > 0 &&
                                roleList.map((role) => (
                                  <MenuItem
                                    value={role.id}
                                    key={"name" + role.id}
                                  >
                                    {role.name}
                                  </MenuItem>
                                ))}
            </Select>
          </FormControl>
          {formik.touched.roleId && formik.errors.roleId && (
            <FormHelperText sx={{color:'#d32f2f',marginLeft:2}}>{formik.errors.roleId}</FormHelperText>
          )}
        </Grid>
        <Grid className='contain'>
          <TextField
            className='field'
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </Grid>
        <Grid className='contain'>
          <TextField
            className='field'
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
        </Grid>
        <Grid className='contain'>
          <Button sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.secondary.main}} type="submit">
            Register
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegistrationForm;
