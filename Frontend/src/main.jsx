import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "plyr-react/plyr.css";
import { Toaster } from "sonner";
import "cropperjs/dist/cropper.css";

import "./index.css";
import App from "./App";
import { store } from "./store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          richColors
          position="bottom-right"
          closeButton
          duration={2500}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);