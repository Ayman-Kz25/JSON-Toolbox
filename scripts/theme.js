import { themeToggle } from "./dom.js";


const THEME_KEY = "json-toolbox-theme";


export function initTheme() {
  if (!themeToggle) return;


  const savedTheme = localStorage.getItem(THEME_KEY);


  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme("light");
  }


  themeToggle.addEventListener("click", toggleTheme);
}



function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme");


  const nextTheme =
    currentTheme === "dark"
      ? "light"
      : "dark";


  setTheme(nextTheme);
}



function setTheme(theme) {
  const icon = themeToggle.querySelector("i");


  if (theme === "dark") {
    document.documentElement.setAttribute(
      "data-theme",
      "dark"
    );


    localStorage.setItem(
      THEME_KEY,
      "dark"
    );


    if (icon) {
      icon.className = "fa-solid fa-sun";
    }

  } else {

    document.documentElement.removeAttribute(
      "data-theme"
    );


    localStorage.setItem(
      THEME_KEY,
      "light"
    );


    if (icon) {
      icon.className = "fa-solid fa-moon";
    }
  }
}
