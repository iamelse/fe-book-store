import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import AppRoutes from "./AppRoutes";
import MetaUpdater from "./components/MetaUpdater";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AppProvider>
      <Toaster position="bottom-right" /> 
      <BrowserRouter>
        <MetaUpdater />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}