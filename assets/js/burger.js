(function () {
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  var desktopQuery = window.matchMedia("(min-width: 769px)");

  if (!burger || !nav) {
    return;
  }

  function isOpen() {
    return document.body.classList.contains("is-menu-open");
  }

  function setOpen(open) {
    document.body.classList.toggle("is-menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  burger.addEventListener("click", function () {
    setOpen(!isOpen());
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
    }
  });

  desktopQuery.addEventListener("change", function (event) {
    if (event.matches) {
      setOpen(false);
    }
  });
})();
