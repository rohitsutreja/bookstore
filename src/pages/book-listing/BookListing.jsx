import React, { useState,useEffect,useMemo } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Typography,
  Divider,
  Button
} from '@mui/material';
import './BookListing.css';
import {defaultFilter} from "../../constant/constant";
import categoryService from "../../service/category.service";
import bookService from "../../service/book.service";
import Shared from '../../utils/Shared';
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth";
import { useCartContext } from "../../context/cart";
import theme from '../../theme';

const BookListing = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const [bookResponse, setBookResponse] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [filters, setFilters] = useState(defaultFilter);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookResponse(res);
    })
  };

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  const books = useMemo(() => {
    const bookList = [...bookResponse.items];
    if (bookList) {
      bookList.forEach((element) => {
        element.category = categories.find(
          (a) => a.id === element.categoryId
        )?.name;
      });
      return bookList;
    }
    return [];
  }, [categories, bookResponse]);

  const sortBooks = (e) => {
    setSortBy(e.target.value);
    const bookList = [...bookResponse.items];

    bookList.sort((a, b) => {
      if (a.name < b.name) {
        return e.target.value === "a-z" ? -1 : 1;
      }
      if (a.name > b.name) {
        return e.target.value === "a-z" ? 1 : -1;
      }
      return 0;
    });
    setBookResponse({ ...bookResponse, items: bookList });
  };

  const addToCart = (book) => {
    Shared.addToCart(book, authContext.user.id).then((res) => {
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        cartContext.updateCart();
      }
    });
  };

  return (
    <div className='book-listing'>
      <Typography variant='h3' className="title" sx={{mb:'10px'}}>
        Book Listing
      </Typography>
      <Divider variant='inset' className='divider' sx={{ backgroundColor: 'rgb(37, 99, 235)' ,width:'25%',height:'1px',m:'auto'}}/>
      <Typography variant="h5">
        Total
        <span> - {bookResponse.totalItems} items</span>
      </Typography>
      <div className="filters">
      <TextField
              id="text"
              className="dropdown-wrapper"
              name="text"
              placeholder="Search..."
              variant="outlined"
              inputProps={{ className: "small" }}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  keyword: e.target.value,
                  pageIndex: 1,
                });
              }}
            />
        <FormControl variant="outlined" className='sort'>
          <InputLabel>Sort Order</InputLabel>
          <Select value={sortBy} onChange={sortBooks} label="Sort Order">
            <MenuItem value="a-z">A-Z</MenuItem>
            <MenuItem value="z-a">Z-A</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="product-list-wrapper">
          <div className="product-list-inner-wrapper">
            {books.map((book, index) => (
              <div className="product-list" key={index}>
                <div className="product-list-inner">
                  <div className='img-center'>
                    <img
                      src={book.base64image}
                      className="image"
                      alt="dummyimage"
                      />
                  </div>
                  <div className="content-wrapper">
                    <Typography variant="h3">{book.name}</Typography>
                    <span className="category">{book.category}</span>
                    <p className="description">{book.description}</p>
                    <p className="price">
                      <span className="discount-price">
                        MRP &#8377; {book.price}
                      </span>
                    </p>
                    <Button onClick={()=>addToCart(book)} variant="outlined" sx={{color:theme.palette.secondary.main,backgroundColor:theme.palette.primary.main}} className="cart-btn">ADD TO CART</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      <div className="pagination-wrapper">
          <Pagination
            count={bookResponse.totalPages}
            page={filters.pageIndex}
            onChange={(e, newPage) => {
              setFilters({ ...filters, pageIndex: newPage });
            }}
          />
        </div>
    </div>
  );
};

export default BookListing;
