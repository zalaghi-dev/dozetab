import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const App: React.FC = () => {
  return (
    <div
      style={{
        width: "400px",
        maxHeight: "600px",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        direction: "rtl",
      }}
    >
      DozeTab
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
