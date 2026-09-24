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
    let remaining = AUTO_DELAY;
    let startedAt = 0;
    let paused = false;

    if (!track || total < 2) {
      return;
    }

    function clearTimer() {
      window.clearTimeout(timer);
      timer = null;
    }

    function restartBar(activeIndex) {
      bars.forEach(function (bar) {
        bar.classList.remove("is-active", "is-paused");
      });
      void root.offsetWidth;
      if (bars[activeIndex]) {
        bars[activeIndex].classList.add("is-active");
      }
    }

    function scheduleNext(delay) {
      clearTimer();
      remaining = delay;
      startedAt = Date.now();
      paused = false;
      timer = window.setTimeout(function () {
        goTo(index + 1);
      }, delay);
    }

    function startAutoplay() {
      scheduleNext(AUTO_DELAY);
    }

    function pauseAutoplay() {
      if (paused) {
        return;
      }

      paused = true;
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
      clearTimer();

      if (bars[index]) {
        bars[index].classList.add("is-paused");
      }
    }

    function resumeAutoplay() {
      if (!paused) {
        return;
      }

      if (bars[index]) {
        bars[index].classList.remove("is-paused");
      }

      scheduleNext(remaining > 0 ? remaining : AUTO_DELAY);
    }

    function goTo(nextIndex) {
      index = (nextIndex + total) % total;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      restartBar(index);
      startAutoplay();
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

    root.addEventListener("mouseenter", pauseAutoplay);
    root.addEventListener("mouseleave", resumeAutoplay);

    track.addEventListener("touchstart", function (event) {
      startX = event.changedTouches[0].clientX;
      pauseAutoplay();
    }, { passive: true });

    track.addEventListener("touchend", function (event) {
      let dx = event.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        goTo(index + (dx < 0 ? 1 : -1));
      } else {
        resumeAutoplay();
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        pauseAutoplay();
      } else {
        resumeAutoplay();
      }
    });

    restartBar(0);
    startAutoplay();
  }

  document.querySelectorAll("[data-slider]").forEach(initSlider);
})();
