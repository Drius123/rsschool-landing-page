(function () {
  let MOBILE_QUERY = "(max-width: 768px)";
  let MOBILE_LIMIT = 4;
  let PRODUCTS_URL = "../assets/js/products.json";
  let IMAGE_PATH = {
    coffee: { folder: "img/coffee", prefix: "coffee", ext: "jpg" },
    tea: { folder: "img/tea", prefix: "tea", ext: "png" },
    dessert: { folder: "img/desert", prefix: "dessert", ext: "png" }
  };

  let tabs = document.querySelectorAll(".menu__tab");
  let list = document.querySelector(".menu__list");
  let moreButton = document.querySelector(".menu__more");
  let panel = document.querySelector("#menu-panel");
  let dialog = document.querySelector(".modal");
  let modalImage = dialog.querySelector(".modal__img");
  let modalTitle = dialog.querySelector(".modal__title");
  let modalText = dialog.querySelector(".modal__text");
  let sizeOptions = dialog.querySelector("[data-size-options]");
  let additiveOptions = dialog.querySelector("[data-additive-options]");
  let totalEl = dialog.querySelector("[data-modal-total]");
  let cards = [];
  let category = "coffee";
  let expanded = false;
  let basePrice = 0;

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function cardsInCategory(name) {
    return cards.filter(function (card) {
      return card.getAttribute("data-category") === name;
    });
  }

  function render() {
    let current = cardsInCategory(category);
    let limit = !isMobile() || expanded ? current.length : MOBILE_LIMIT;

    cards.forEach(function (card) {
      let match = card.getAttribute("data-category") === category;
      let index = current.indexOf(card);
      card.hidden = !match || index >= limit;
    });

    moreButton.hidden = !isMobile() || expanded || current.length <= MOBILE_LIMIT;
  }

  function formatPrice(value) {
    return "$" + value.toFixed(2);
  }

  function imageSrc(product, indexInCategory) {
    let path = IMAGE_PATH[product.category];
    return path.folder + "/" + path.prefix + "-" + (indexInCategory + 1) + "." + path.ext;
  }

  function createCard(product, indexInCategory) {
    let card = document.createElement("li");
    let article = document.createElement("article");
    let media = document.createElement("div");
    let image = document.createElement("img");
    let body = document.createElement("div");
    let title = document.createElement("h2");
    let text = document.createElement("p");
    let price = document.createElement("p");

    card.className = "menu__card";
    card.setAttribute("data-category", product.category);
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.product = product;

    media.className = "menu__card-media";
    image.src = imageSrc(product, indexInCategory);
    image.alt = product.name;
    image.width = 310;
    image.height = 310;

    body.className = "menu__card-body";
    title.className = "menu__card-title";
    title.textContent = product.name;
    text.className = "menu__card-text";
    text.textContent = product.description;
    price.className = "menu__card-price";
    price.textContent = formatPrice(parseFloat(product.price));

    media.append(image);
    body.append(title, text, price);
    article.append(media, body);
    card.append(article);

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

    return card;
  }

  function updateTotal() {
    let sizeInput = dialog.querySelector('input[name="modal-size"]:checked');
    let sizeExtra = sizeInput ? parseFloat(sizeInput.value) : 0;
    let additiveExtra = 0;

    dialog.querySelectorAll('input[name="modal-additive"]:checked').forEach(function (input) {
      additiveExtra += parseFloat(input.value);
    });

    totalEl.textContent = formatPrice(basePrice + sizeExtra + additiveExtra);
  }

  function createOption(type, name, mark, label, extra, checked) {
    let option = document.createElement("label");
    let input = document.createElement("input");
    let badge = document.createElement("span");
    let text = document.createElement("span");

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

  function fillOptions(product) {
    let sizeKeys = ["s", "m", "l"];

    sizeOptions.replaceChildren();
    additiveOptions.replaceChildren();

    sizeKeys.forEach(function (key, index) {
      let size = product.sizes[key];
      sizeOptions.append(createOption(
        "radio",
        "modal-size",
        key.toUpperCase(),
        size.size,
        parseFloat(size["add-price"]),
        index === 0
      ));
    });

    product.additives.forEach(function (additive, index) {
      additiveOptions.append(createOption(
        "checkbox",
        "modal-additive",
        String(index + 1),
        additive.name,
        parseFloat(additive["add-price"]),
        false
      ));
    });
  }

  function lockScroll() {
    let gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = gap + "px";
  }

  function unlockScroll() {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  function openModal(card) {
    let product = card.product;
    let image = card.querySelector("img");

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTitle.textContent = product.name;
    modalText.textContent = product.description;
    basePrice = parseFloat(product.price);

    fillOptions(product);
    updateTotal();
    dialog.showModal();
    lockScroll();
  }

  function bindTabs() {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        let next = tab.getAttribute("data-category");
        if (next === category) {
          return;
        }

        category = next;
        expanded = false;

        tabs.forEach(function (item) {
          let active = item === tab;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", active ? "true" : "false");
        });

        panel.setAttribute("aria-labelledby", tab.id);
        render();
      });
    });
  }

  function init(products) {
    let counters = { coffee: 0, tea: 0, dessert: 0 };

    products.forEach(function (product) {
      let index = counters[product.category];
      counters[product.category] += 1;
      cards.push(createCard(product, index));
    });

    list.append.apply(list, cards);
    bindTabs();

    moreButton.addEventListener("click", function () {
      expanded = true;
      render();
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
  }

  fetch(PRODUCTS_URL)
    .then(function (response) {
      return response.json();
    })
    .then(init);
})();
