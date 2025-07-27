import '@fontsource-variable/lexend/index.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const hideLoader = () => {
  const loader = document.getElementById("loader");
  const loaderCSS = document.getElementById("loader-css");

  if (loader) {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    // Wait for the CSS transition to finish before removing
    loader.addEventListener(
      "transitionend",
      () => {
        loader.remove();
        if (loaderCSS) loaderCSS.remove();
      },
      { once: true }
    );
  }

  console.log("Window Loaded.");
};


document.addEventListener("DOMContentLoaded", hideLoader);
window.addEventListener("load", hideLoader);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
