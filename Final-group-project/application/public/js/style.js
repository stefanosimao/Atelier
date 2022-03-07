function darkMode() {
    var element = document.documentElement;
    localStorage.setItem("dark", element.classList.toggle("dark-mode"));
}