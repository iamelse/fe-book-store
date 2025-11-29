import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import AppRoutes from "./AppRoutes";
import MetaUpdater from "./components/MetaUpdater";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MetaUpdater />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}