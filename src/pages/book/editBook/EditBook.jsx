import { Typography,Divider, TextField,FormControl,InputLabel,Select,MenuItem,Input,Button, FormHelperText } from '@mui/material'
import React,{useState,useEffect} from 'react'
import { Formik } from "formik";
import categoryService from '../../../service/category.service';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import bookService from '../../../service/book.service';
import Shared from '../../../utils/Shared';
import theme from '../../../theme';
import './EditBook.css';

function EditBook() {
    const {id} = useParams();
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const initialValues = {
        name:"",
        price:"",
        categoryId:0,
        description:"",
        base64image:"",
    }
    const [initialValueState, setInitialValueState] = useState(initialValues);
    useEffect(() => {
        if (id) getBookById();
        categoryService.getAll().then((res) => {
          setCategories(res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [id]);

      const validationSchema = Yup.object().shape({
        name: Yup.string().required("Book Name is required"),
        description: Yup.string().required("Description is required"),
        categoryId: Yup.number()
          .min(1, "Category is required")
          .required("Category is required"),
        price: Yup.number().required("Price is required"),
        base64image: Yup.string().required("Image is required"),
      });

      const getBookById = () => {
        bookService.getById(Number(id)).then((res) => {
          setInitialValueState({
            id: res.id,
            name: res.name,
            price: res.price,
            categoryId: res.categoryId,
            description: res.description,
            base64image: res.base64image,
          });
        }).catch((e)=> toast.error("something went wrong!"));
      };
      const onSubmit = (values) => {
        bookService
          .save(values)
          .then((res) => {
            toast.success(
              values.id
                ? Shared.messages.UPDATED_SUCCESS
                : "Record created successfully"
            );
            navigate("/Book");
          })
          .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
      };

      const onSelectFile = (e, setFieldValue, setFieldError) => {
        const files = e.target.files;
        if (files?.length) {
          const fileSelected = e.target.files[0];
          const fileNameArray = fileSelected.name.split(".");
          const extension = fileNameArray.pop();
          if (["png", "jpg", "jpeg"].includes(extension?.toLowerCase())) {
            if (fileSelected.size > 50000) {
              toast.error("File size must be less then 50KB");
              return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(fileSelected);
            reader.onload = function () {
              setFieldValue("base64image", reader.result);
            };
            reader.onerror = function (error) {
              throw error;
            };
          } else {
            toast.error("only jpg,jpeg and png files are allowed");
          }
        } else {
          setFieldValue("base64image", "");
        }
      };
  return (
    <>
        <Typography variant='h4' align='center' sx={{mb:'10px'}}>{id ? "Edit":"Add"} Book</Typography>
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
                        name='name'
                        label="Book Name *"
                        variant='outlined'
                        inputProps={{className:"small"}}
                        value={values.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        />
                    </div>
                    <div className='form-col'>
                    <TextField
                    type={"number"}
                    id="price"
                    name="price"
                    label="Book Price (RS)*"
                    variant="outlined"
                    inputProps={{ className: "small" }}
                    value={values.price}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                    />
                    </div>
                    <div className='form-col'>

                  <FormControl className="dropdown-wrapper" variant="outlined">
                    <InputLabel htmlFor="select">Category *</InputLabel>
                    <Select
                      name={"categoryId"}
                      id={"category"}
                      label="Category *"
                      onChange={handleChange}
                      value={values.categoryId}
                      error={touched.categoryId && Boolean(errors.categoryId)}
                      >
                      {categories?.map((rl) => (
                          <MenuItem value={rl.id} key={"category" + rl.id}>
                          {rl.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  </div>
                  <div className='form-col'>

                  {!values.base64image && (
                      <div className='upload-file'>
                      {" "}
                      <label
                        htmlFor="contained-button-file"
                        className="file-upload-btn"
                        >
                        <Input
                          id="contained-button-file"
                          type="file"
                          inputProps={{ className: "small" }}
                          onBlur={handleBlur}
                          onChange={(e) => {
                              onSelectFile(e, setFieldValue, setFieldError);
                            }}
                            />
                        <Button
                          variant="contained"
                          sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.secondary.main,p:'8px',m:'8px'}}
                          component="span"
                          className="upload-btn"
                          >
                          Upload
                        </Button>
                      </label>
                      <FormHelperText
                        message={errors.base64image}
                        touched={touched.base64image}
                        />
                    </div>
                  )}
                  {values.base64image && (
                      <div className="uploaded-file-name">
                      <em>
                        <img src={values.base64image} alt="" />
                      </em>
                      image{" "}
                      <span
                        onClick={() => {
                            setFieldValue("base64image", "");
                        }}
                        >
                        x
                      </span>
                    </div>
                  )}
                  </div>
                  <div className='form-col'>

                  <TextField
                    id="description"
                    name="description"
                    label="Description *"
                    variant="outlined"
                    value={values.description}
                    multiline
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
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
                      navigate("/book");
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

export default EditBook