import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const hideLoader = () => {
  const loader = document.getElementById("loader");
  const loaderCSS = document.getElementById("loader-css");
  console.log("loader and loaderCSS : ", loader, loaderCSS)
  if (loader) {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(() => {
      loader.remove();
      loaderCSS ? loaderCSS.remove() : null;
    }, 500); // remove from DOM for cleanliness
    console.log("loader removed")
  }

};


document.addEventListener("DOMContentLoaded", hideLoader);
window.addEventListener("load", hideLoader);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
