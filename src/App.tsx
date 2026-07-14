import { Bounce, ToastContainer } from "react-toastify";
import AppRoutes from "./router";
import "./App.css";

function App() {
  return (
    <>
      <ToastContainer
        style={{ zIndex: 70000 }}
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <AppRoutes />
    </>
  );
}

export default App;
