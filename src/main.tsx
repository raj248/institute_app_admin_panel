import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const hideLoader = () => {
  const loader = document.getElementById("loader");
  const loaderCSS = document.getElementById("loader-css");
  console.log("function called after load")
  if (loader && loaderCSS) {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(() => {
      loader.remove();
      loaderCSS.remove()
    }, 500); // remove from DOM for cleanliness
    console.log("loader removed")
  }

};


if (document.readyState === "complete") {
  hideLoader();
} else {
  window.addEventListener("load", hideLoader);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
