

import React from "react";
import { Route, Routes } from "react-router-dom";
import { Canvas } from "./MapPage/Canvas";
import EffectPage from "./EffectPage/EffectPage";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <div className="App">
                        <Canvas />
                    </div>
                }
            />{" "}
            <Route
                path="/s"
                element={
                    <div className="App">
                        <EffectPage />
                    </div>
                }
            />
        </Routes>
    );
}

export default App;
