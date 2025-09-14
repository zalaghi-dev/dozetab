import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Popup from "@/Popup";
const PopupProvider: React.FC = () => {
  return <Popup />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(<PopupProvider />);
