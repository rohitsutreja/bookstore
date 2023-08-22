import React,{useContext,useState} from 'react';
import { TextField, Button, Grid} from '@mui/material';
import { AuthContext, useAuthContext } from "../../context/auth";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import userService from "../../service/user.service";
import Shared from '../../utils/Shared';
import { toast } from "react-toastify";
import theme from '../../theme';
import './UpdateProfile.css';
import { RoutePaths } from '../../utils/enum';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const { user } = useContext(AuthContext);

  const [updatePassword, setUpdatePassword] = useState(false);

  const validationSchema = yup.object({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    newPassword: yup.string().required('Password is required').min(5, 'Password must be at least 5 characters'),
    confirmPassword: updatePassword ? yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('newPassword')], 'Passwords must match'):
      yup.string().oneOf([yup.ref("newPassword")], "Passwords is not match"),
  });

  const onSubmit = async (values) => {
    const password = values.newPassword ? values.newPassword : user.password;
    delete values.confirmPassword;
    delete values.newPassword;

    const data = Object.assign(user, { ...values, password });
    delete data._id;
    delete data.__v;
    const res = await userService.updateProfile(data);
    if (res) {
      authContext.setUser(res);
      toast.success(Shared.messages.UPDATED_SUCCESS);
      navigate("/");
    }
  };

  const formik = useFormik({
    initialValues: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        newPassword: "",
        confirmPassword: "",
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
          <TextField
            className='field'
            id="newPassword"
            name="newPassword"
            label="New Password"
            type="password"
            value={formik.values.password}
            inputProps = {{className:"small"}}
            onChange={(e) => {
                e.target.value !== ""
                  ? setUpdatePassword(true)
                  : setUpdatePassword(false);
                  // eslint-disable-next-line
                {formik.handleChange(e)}
              }}
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
            inputProps={{ className: "small" }}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
        </Grid>
        <Grid className='contain'>
          <Button sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.secondary.main,mr:'10px'}} type="submit">
            Save
          </Button>
          <Button sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.secondary.main}} onClick={()=>{navigate(RoutePaths.BookListing)}} type="submit">
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UpdateProfile;
