(function () {
  var STORAGE_KEY = "coffee-house-theme";
  var toggle = document.querySelector(".theme-toggle");

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);

    if (!toggle) {
      return;
    }

    var isDark = theme === "dark";
    toggle.setAttribute("aria-checked", String(isDark));
    toggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  setTheme(getTheme());

  if (toggle) {
    toggle.addEventListener("click", function () {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }
})();
