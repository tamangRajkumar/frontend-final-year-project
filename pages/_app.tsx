import "../styles/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";
import { Provider } from "react-redux";
import store from "../redux/store";
import { useRouter } from "next/router";
import "../styles/globals.css";

//Tostify notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../src/components/headerFooter/Navbar";
import Footer from "../src/components/headerFooter/Footer";
import { SocketProvider } from "../src/contexts/SocketContext";
import { cleanToken } from "../src/utils/tokenUtils";

function MyApp({ Component, pageProps }: AppProps) {
  //axios configuration
  // axios.defaults.baseURL = "http://localhost:9000/api";
  //https://backend-final-year-project-q91n.onrender.com
  axios.defaults.baseURL = "https://backend-final-year-project-q91n.onrender.com/api";


  // Add request interceptor to clean tokens
  axios.interceptors.request.use((config) => {
    if (config.headers?.Authorization) {
      const authHeader = config.headers.Authorization as string;
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const cleanTokenValue = cleanToken(token);
        if (cleanTokenValue) {
          config.headers.Authorization = `Bearer ${cleanTokenValue}`;
        }
      }
    }
    return config;
  });

  return (
    <>
      <Provider store={store}>
        <SocketProvider>
          <AppContent Component={Component} pageProps={pageProps} />
        </SocketProvider>
      </Provider>
    </>
  );
}

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Check if current page is chat page
  const isChatPage = router.pathname === '/chat';

  return (
    <div className="bg-gray-50">
      <Navbar />
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
      
      {!isChatPage && <Footer />}
    </div>
  );
}

export default MyApp;
