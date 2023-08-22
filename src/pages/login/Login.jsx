import React from 'react';
import { TextField, Button, Grid, Typography, Link } from '@mui/material';
// import axios from 'axios';
import { makeStyles } from '@mui/styles';
import { useFormik } from 'formik';
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import theme from '../../theme';
import * as yup from 'yup';
import { useAuthContext } from "../../context/auth";
import authService from "../../service/auth.service";
import { RoutePaths } from '../../utils/enum';

const validationSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const useStyles = makeStyles((theme) => ({
  container: {
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '300px',
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  submitButton: {
    marginTop: '16px',
  },
  createAccountLink: {
    display: 'block',
    marginTop: '16px',
  },
}));

const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const authContext = useAuthContext();

  const onSubmit = (data) => {
    // try {
    //   const response = await axios.post(
    //     "https://book-e-sell-node-api.vercel.app/api/user/login",
    //     {
    //       email: values.email,
    //       password: values.password,
    //     }
    //   );
    //   const userData = response.data.result;
    //   toast.success("Login successfully!");
    //   localStorage.setItem('id', userData._id);
    //   navigate("/Home");
    // } catch (error) {
    //   toast.error("Invalid credentials");
    //   console.error(error);
    // }
    authService.login(data).then((res) => {
      // console.log("call from auth.s")
      toast.success("Login successfully");
      authContext.setUser(res);
      navigate(RoutePaths.BookListing);
    
    }).catch(()=>{});
  };


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <>
<div className={classes.container}>
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} direction="column">
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.submitButton}
              fullWidth
              variant="contained"
              sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.secondary.main}}
              type="submit"
              onClick={formik.handleSubmit}
            >
              Login
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <Link onClick={()=>{navigate("/Registration")}} className={classes.createAccountLink}>
                Create Account
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </div>
    </>
  );
};

export default Login;











// import React, { useContext } from "react";
// // import { loginStyle } from "./Login.css";
// import {
//   Breadcrumbs,
//   Button,
//   Link,
//   List,
//   ListItem,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { Formik } from "formik";
// // import ValidationErrorMessage from "../../components/ValidationErrorMessage";
// import { useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import authService from "../../service/auth.service";
// import { toast } from "react-toastify";
// import { useAuthContext } from "../../context/auth";

// export const Login = () => {
//   const navigate = useNavigate();
//   const authContext = useAuthContext();

//   const initialValues = {
//     email: "",
//     password: "",
//   };

//   const validationSchema = Yup.object().shape({
//     email: Yup.string()
//       .email("Email is not valid")
//       .required("Email is required"),
//     password: Yup.string()
//       .min(5, "Password must be more than 5 charector")
//       .required("Password is required."),
//   });

//   // const classes = loginStyle();

//   const onSubmit = (data) => {
//     authService.login(data).then((res) => {
//       toast.success("Login successfully");
//       authContext.setUser(res);
//     });
//   };

//   return (
//     <div className="">
//       <div className="login-page-wrapper">
//         <div className="container">
//           <Breadcrumbs
//             separator="›"
//             aria-label="breadcrumb"
//             className="breadcrumb-wrapper"
//           >
//             <Link color="inherit" href="/" title="Home">
//               Home
//             </Link>
//             <Typography color="textPrimary">Login</Typography>
//           </Breadcrumbs>
//           <Typography variant="h1">Login or Create an Account</Typography>
//           <div className="login-row">
//             <div className="content-col">
//               <div className="top-content">
//                 <Typography variant="h2">New Customer</Typography>
//                 <p>Registration is free and easy.</p>
//                 <List className="bullet-list">
//                   <ListItem>Faster checkout</ListItem>
//                   <ListItem>Save multiple shipping addresses</ListItem>
//                   <ListItem>View and track orders and more</ListItem>
//                 </List>
//               </div>
//               <div className="btn-wrapper">
//                 <Button
//                   className="pink-btn btn"
//                   variant="contained"
//                   color="primary"
//                   disableElevation
//                   onClick={() => {
//                     navigate("/register");
//                   }}
//                 >
//                   Create an Account
//                 </Button>
//               </div>
//             </div>
//             <div className="form-block">
//               <Typography variant="h2">Registered Customers</Typography>
//               <p>If you have an account with us, please log in.</p>
//               <Formik
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={onSubmit}
//               >
//                 {({
//                   values,
//                   errors,
//                   touched,
//                   handleBlur,
//                   handleChange,
//                   handleSubmit,
//                 }) => (
//                   <form onSubmit={handleSubmit}>
//                     <div className="form-row-wrapper">
//                       <div className="form-col">
//                         <TextField
//                           id="email"
//                           name="email"
//                           onBlur={handleBlur}
//                           onChange={handleChange}
//                           label="Email Address *"
//                           autoComplete="off"
//                           variant="outlined"
//                           inputProps={{ className: "small" }}
//                         />
//                         {/* <ValidationErrorMessage
//                           message={errors.email}
//                           touched={touched.email}
//                         /> */}
//                       </div>
//                       <div className="form-col">
//                         <TextField
//                           id="password"
//                           name="password"
//                           label="Password *"
//                           type="password"
//                           variant="outlined"
//                           onBlur={handleBlur}
//                           onChange={handleChange}
//                           inputProps={{ className: "small" }}
//                           autoComplete="off"
//                         />
//                         {/* <ValidationErrorMessage
//                           message={errors.password}
//                           touched={touched.password}
//                         /> */}
//                       </div>
//                       <div className="btn-wrapper">
//                         <Button
//                           type="submit"
//                           className="pink-btn btn"
//                           variant="contained"
//                           color="primary"
//                           disableElevation
//                           onClick={handleSubmit}
//                         >
//                           Login
//                         </Button>
//                       </div>
//                     </div>
//                   </form>
//                 )}
//               </Formik>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
