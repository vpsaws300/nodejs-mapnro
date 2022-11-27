import React from "react";
import ReactDOM from "react-dom/client";
import "react-image-crop/src/ReactCrop.scss";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ContextType } from "./hooks/hooks";
import "./index.css";
export const Ctx = React.createContext<ContextType | null>(null);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
