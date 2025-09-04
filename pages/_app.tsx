import "../styles/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";
import { Provider } from "react-redux";
import store from "../redux/store";
import "../styles/globals.css";

//Tostify notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../src/components/headerFooter/Navbar";
import Footer from "../src/components/headerFooter/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  //axios configuration
  axios.defaults.baseURL = "http://localhost:9000/api";

  return (
    <>
      <Provider store={store}>
        <div className="bg-gray-50">
          <Navbar />
          <Component {...pageProps} />
          <ToastContainer position="bottom-right" />
        
          < Footer />
        </div>
      </Provider>
    </>
  );
}

export default MyApp;
