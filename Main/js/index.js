(function () {
  let AUTO_DELAY = 6000;

  function initSlider(root) {
    let track = root.querySelector(".slider__track");
    let slides = root.querySelectorAll(".slider__slide");
    let prev = root.querySelector(".slider__btn--prev");
    let next = root.querySelector(".slider__btn--next");
    let bars = root.querySelectorAll(".slider__bar");
    let total = slides.length;
    let index = 0;
    let timer = null;
    let startX = 0;

    if (!track || total < 2) {
      return;
    }

    function restartBar(activeIndex) {
      bars.forEach(function (bar) {
        bar.classList.remove("is-active");
      });
      void root.offsetWidth;
      if (bars[activeIndex]) {
        bars[activeIndex].classList.add("is-active");
      }
    }

    function goTo(nextIndex) {
      index = (nextIndex + total) % total;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      restartBar(index);
      startAutoplay();
    }

    function startAutoplay() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, AUTO_DELAY);
    }

    function stopAutoplay() {
      window.clearInterval(timer);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        goTo(index - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        goTo(index + 1);
      });
    }

    bars.forEach(function (bar) {
      bar.addEventListener("click", function () {
        goTo(Number(bar.getAttribute("data-slide")));
      });
    });

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);

    track.addEventListener("touchstart", function (event) {
      startX = event.changedTouches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener("touchend", function (event) {
      let dx = event.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        goTo(index + (dx < 0 ? 1 : -1));
      } else {
        startAutoplay();
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    restartBar(0);
    startAutoplay();
  }

  document.querySelectorAll("[data-slider]").forEach(initSlider);
})();
