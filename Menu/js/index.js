(function () {
  var MOBILE_QUERY = "(max-width: 768px)";
  var MOBILE_LIMIT = 4;
  var OPTIONS = {
    coffee: {
      sizes: [
        { mark: "S", label: "200 ml", extra: 0 },
        { mark: "M", label: "300 ml", extra: 0.5 },
        { mark: "L", label: "400 ml", extra: 1 }
      ],
      additives: [
        { name: "Sugar", extra: 0.5 },
        { name: "Cinnamon", extra: 0.5 },
        { name: "Syrup", extra: 0.5 }
      ]
    },
    tea: {
      sizes: [
        { mark: "S", label: "200 ml", extra: 0 },
        { mark: "M", label: "300 ml", extra: 0.5 },
        { mark: "L", label: "400 ml", extra: 1 }
      ],
      additives: [
        { name: "Sugar", extra: 0.5 },
        { name: "Lemon", extra: 0.5 },
        { name: "Syrup", extra: 0.5 }
      ]
    },
    dessert: {
      sizes: [
        { mark: "S", label: "50 g", extra: 0 },
        { mark: "M", label: "100 g", extra: 0.5 },
        { mark: "L", label: "200 g", extra: 1 }
      ],
      additives: [
        { name: "Berries", extra: 0.5 },
        { name: "Nuts", extra: 0.5 },
        { name: "Jam", extra: 0.5 }
      ]
    }
  };

  var tabs = document.querySelectorAll(".menu__tab");
  var cards = document.querySelectorAll(".menu__card");
  var moreButton = document.querySelector(".menu__more");
  var dialog = document.querySelector(".modal");
  var modalImage = dialog.querySelector(".modal__img");
  var modalTitle = dialog.querySelector(".modal__title");
  var modalText = dialog.querySelector(".modal__text");
  var sizeOptions = dialog.querySelector("[data-size-options]");
  var additiveOptions = dialog.querySelector("[data-additive-options]");
  var totalEl = dialog.querySelector("[data-modal-total]");
  var category = "coffee";
  var expanded = false;
  var basePrice = 0;

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function cardsInCategory(name) {
    return Array.prototype.filter.call(cards, function (card) {
      return card.getAttribute("data-category") === name;
    });
  }

  function render() {
    var current = cardsInCategory(category);
    var limit = !isMobile() || expanded ? current.length : MOBILE_LIMIT;

    cards.forEach(function (card) {
      var match = card.getAttribute("data-category") === category;
      var index = current.indexOf(card);
      card.hidden = !match || index >= limit;
    });

    moreButton.hidden = !isMobile() || expanded || current.length <= MOBILE_LIMIT;
  }

  function formatPrice(value) {
    return "$" + value.toFixed(2);
  }

  function parsePrice(text) {
    return parseFloat(text.replace("$", "")) || 0;
  }

  function updateTotal() {
    var sizeInput = dialog.querySelector('input[name="modal-size"]:checked');
    var sizeExtra = sizeInput ? parseFloat(sizeInput.value) : 0;
    var additiveExtra = 0;

    dialog.querySelectorAll('input[name="modal-additive"]:checked').forEach(function (input) {
      additiveExtra += parseFloat(input.value);
    });

    totalEl.textContent = formatPrice(basePrice + sizeExtra + additiveExtra);
  }

  function createOption(type, name, mark, label, extra, checked) {
    var option = document.createElement("label");
    var input = document.createElement("input");
    var badge = document.createElement("span");
    var text = document.createElement("span");

    option.className = "modal__option";
    input.className = "visually-hidden";
    input.type = type;
    input.name = name;
    input.value = String(extra);
    input.checked = checked;
    badge.className = "modal__option-mark";
    badge.textContent = mark;
    text.textContent = label;

    option.append(input, badge, text);
    return option;
  }

  function fillOptions(card) {
    var data = OPTIONS[card.getAttribute("data-category")];

    sizeOptions.replaceChildren();
    additiveOptions.replaceChildren();

    data.sizes.forEach(function (size, index) {
      sizeOptions.append(createOption("radio", "modal-size", size.mark, size.label, size.extra, index === 0));
    });

    data.additives.forEach(function (additive, index) {
      additiveOptions.append(createOption("checkbox", "modal-additive", String(index + 1), additive.name, additive.extra, false));
    });
  }

  function lockScroll() {
    var gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = gap + "px";
  }

  function unlockScroll() {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  function openModal(card) {
    var image = card.querySelector("img");

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTitle.textContent = card.querySelector(".menu__card-title").textContent;
    modalText.textContent = card.querySelector(".menu__card-text").textContent;
    basePrice = parsePrice(card.querySelector(".menu__card-price").textContent);

    fillOptions(card);
    updateTotal();
    dialog.showModal();
    lockScroll();
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var next = tab.getAttribute("data-category");
      if (next === category) {
        return;
      }

      category = next;
      expanded = false;

      tabs.forEach(function (item) {
        var active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });

      render();
    });
  });

  moreButton.addEventListener("click", function () {
    expanded = true;
    render();
  });

  cards.forEach(function (card) {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    card.addEventListener("click", function () {
      if (card.hidden) {
        return;
      }
      openModal(card);
    });

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", unlockScroll);
  dialog.addEventListener("change", updateTotal);

  window.addEventListener("resize", function () {
    if (!isMobile()) {
      expanded = false;
    }
    render();
  });

  render();
})();
