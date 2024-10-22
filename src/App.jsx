import React from "react";

import AuthFromStudent from "./components/Login/AuthFromStudent";
const App = () => {
  return (
    <div className="bg-gray-900 flex flex-col gap-10 h-screen items-center justify-center">
      <AuthFromStudent />
    </div>
  );
};

export default App;
