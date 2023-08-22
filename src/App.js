import Navbar from "./Components/header/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from '@mui/material/CircularProgress';
import { BrowserRouter } from "react-router-dom";
import { MainNavigation } from "./Components/MainNavigation/MainNavigation";
// import Search from "./Components/header/Search";
import { AuthWrapper } from "./context/auth";
import { ThemeProvider } from "@mui/system";
import theme from './theme';
import { CartWrapper } from "./context/cart";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <ToastContainer/>
      <BrowserRouter>
      <AuthWrapper>
      <CartWrapper>
      <Navbar/>
      {/* <Search/> */}
      <div className="loader-wrapper">
          <CircularProgress/>
      </div>
      <MainNavigation/>
      </CartWrapper>
      </AuthWrapper>
      </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
