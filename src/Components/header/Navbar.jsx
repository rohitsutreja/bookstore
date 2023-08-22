import React, { useMemo,useState } from 'react';
import { AppBar, Toolbar, Typography, List, ListItem,Button,TextField } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { RoutePaths } from '../../utils/enum';
// import logo from "../../assets/cart.png";
import Shared from '../../utils/Shared';
import theme from '../../theme';
import { Link, NavLink } from 'react-router-dom';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import { useAuthContext } from '../../context/auth';
import { useCartContext } from "../../context/cart";
import bookService from "../../service/book.service";
import SearchIcon from '@mui/icons-material/Search';

const Navbar = () => {
  const navigate = useNavigate();
  // const open = false;
  const [query, setquery] = useState("");
  const [bookList, setbookList] = useState([]);
  const [openSearchResult, setOpenSearchResult] = useState(false);
  const authContext = useAuthContext();
  const cartContext = useCartContext();

  const logOut = () => {
    authContext.signOut();
    cartContext.emptyCart();
  };

  // const openMenu = () => {
  //   document.body.classList.toggle("open-menu");
  // }; 

  const items = useMemo(() => {
    return Shared.NavigationItems.filter(
      (item) =>
        !item.access.length || item.access.includes(authContext.user.roleId)
    );
  }, [authContext.user]);

  const searchBook = async () => {
    const res = await bookService.searchBook(query);
    setbookList(res);
  };

  const search = () => {
    document.body.classList.add("search-results-open");
    searchBook();
    setOpenSearchResult(true);
  };

  const addToCart = (book) => {
    if (!authContext.user.id) {
      navigate(RoutePaths.Login);
      toast.error("Please login before adding books to cart");
    } else {
      Shared.addToCart(book, authContext.user.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Item added in cart");
          cartContext.updateCart();
        }
      });
    }
  };

  return (
    <>
    <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
      <Toolbar className="tool">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme.palette.secondary.main }}>
          EbookStore
        </Typography>
        <List className="li">
          {!authContext.user.id && (
            <>
              <ListItem className="ui">
                <NavLink to={RoutePaths.Login} title="Login" className="btn">
                  Login
                </NavLink>
              </ListItem>
              <ListItem>
                <Link to={RoutePaths.Register} title="Register" className="btn" >
                  Register
                </Link>
              </ListItem>
            </>
          )}
          {items.map((item, index) => (
            <ListItem key={index} sx={{width:'auto',py:'8px',px:'6px'}}>
              <Link to={item.route} title={item.name} className="btn" >
                {item.name}
              </Link>
            </ListItem>
          ))}
          {authContext.user.id && (
            <List>
              <Button onClick={() => logOut()} sx={{backgroundColor: 'rgb(37, 99, 235)',color: 'white',textTransform:'lowercase',fontSize:'1rem',lineHeight:'1.2'}} className="btn">
                Logout
              </Button>
            </List>
          )}
        </List>
        <List className="cart-country-wrap">
                    <ListItem className="cart-link">
                      <Link to="/cart" title="Cart">
                        {/* <img src={logo} alt="cart.png"/>
                        <span>{cartContext.cartData.length}</span>
                        Cart */}
                        <ShoppingCartOutlinedIcon color='secondary'/>
                      </Link>
                    </ListItem>
                    {/* <ListItem className="hamburger" onClick={openMenu}>
                      <span></span>
                    </ListItem> */}
          </List>
      </Toolbar>
    </AppBar>
      <div
          className="search-overlay"
          onClick={() => {
            setOpenSearchResult(false);
            document.body.classList.remove("search-results-open");
          }}
          ></div>
        <div className="header-search-wrapper">
          <div className="container">
            <div className="header-search-outer">
              <div className="header-search-inner">
                <div className="text-wrapper">
                  <TextField
                    id="text"
                    name="text"
                    className="field" 
                    placeholder="What are you looking for..."
                    variant="outlined"
                    value={query}
                    onChange={(e) => setquery(e.target.value)}
                    />

                  {openSearchResult && (
                    <>
                      <div className="product-listing">
                        {bookList?.length === 0 && (
                          <p className="no-product">No product found</p>
                          )}

                        {/* <p className="loading">Loading....</p> */}
                        <List className="related-product-list">
                          {bookList?.length > 0 &&
                            bookList.map((item, i) => {
                              return (
                                <ListItem key={i}>
                                  <div className="inner-block">
                                    <div className="left-col">
                                      <span className="title">{item.name}</span>
                                      <p>{item.description}</p>
                                    </div>
                                    <div className="right-col">
                                      <span className="price">
                                        {item.price}
                                      </span>
                                      <Link onClick={() => addToCart(item)}>
                                        Add to cart
                                      </Link>
                                    </div>
                                  </div>
                                </ListItem>
                              );
                            })}
                        </List>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  type="submit"
                  className="green-btn btn"
                  variant="contained"
                  color="success"
                  disableElevation
                  onClick={search}
                  >
                  <em>
                    <SearchIcon/>
                  </em>
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>

  );
};

export default Navbar;
