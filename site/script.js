const initializeFlavorExplorer = () => {
  const explorer = document.querySelector('[data-flavor-explorer]');
  if (!explorer) return;

  const buttons = Array.from(explorer.querySelectorAll('.flavor-option'));
  const featuredImage = explorer.querySelector('[data-featured-image]');
  const featuredName = explorer.querySelector('[data-featured-name]');
  const featuredIndex = explorer.querySelector('[data-featured-index]');

  const selectFlavor = (button, index) => {
    featuredImage.src = button.dataset.image;
    featuredImage.alt = button.dataset.alt;
    featuredName.textContent = button.dataset.name;
    featuredIndex.textContent = `${String(index + 1).padStart(2, '0')} / ${String(buttons.length).padStart(2, '0')}`;

    buttons.forEach((option) => {
      option.setAttribute('aria-pressed', String(option === button));
    });
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => selectFlavor(button, index));
    button.addEventListener('keydown', (event) => {
      const keyDirections = {
        ArrowDown: 1,
        ArrowRight: 1,
        ArrowUp: -1,
        ArrowLeft: -1,
      };
      const direction = keyDirections[event.key];

      if (direction === undefined) return;

      event.preventDefault();
      const nextIndex = (index + direction + buttons.length) % buttons.length;
      buttons[nextIndex].focus();
      selectFlavor(buttons[nextIndex], nextIndex);
    });
  });
};

const initializeProductExplorer = () => {
  const explorer = document.querySelector('[data-product-explorer]');
  if (!explorer) return;

  const buttons = Array.from(explorer.querySelectorAll('.product-option'));
  const featuredImages = explorer.querySelector('[data-featured-product-images]');
  const featuredName = explorer.querySelector('[data-featured-product-name]');
  const featuredIndex = explorer.querySelector('[data-featured-product-index]');

  const selectProduct = (button) => {
    const thumbnails = Array.from(button.querySelectorAll('.product-option-thumbs img'));
    const images = thumbnails.map((thumbnail) => {
      const image = document.createElement('img');
      image.className = 'featured-product-image';
      image.src = thumbnail.getAttribute('src');
      image.alt = thumbnail.dataset.alt;
      return image;
    });

    featuredImages.replaceChildren(...images);
    featuredImages.dataset.imageCount = String(images.length);
    featuredName.textContent = button.dataset.name;
    featuredIndex.textContent = `${button.dataset.number} / 06`;

    buttons.forEach((option) => {
      option.setAttribute('aria-pressed', String(option === button));
    });
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => selectProduct(button));
    button.addEventListener('keydown', (event) => {
      const keyDirections = {
        ArrowDown: 1,
        ArrowRight: 1,
        ArrowUp: -1,
        ArrowLeft: -1,
      };
      const direction = keyDirections[event.key];

      if (direction === undefined) return;

      event.preventDefault();
      const nextIndex = (index + direction + buttons.length) % buttons.length;
      buttons[nextIndex].focus();
      selectProduct(buttons[nextIndex]);
    });
  });
};

const initializePackageSelector = () => {
  const selector = document.querySelector('[data-package-selector]');
  if (!selector) return;

  const tabs = Array.from(selector.querySelectorAll('[data-package-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-package-panel]'));

  const selectPackage = (tab, moveFocus = false) => {
    const packageId = tab.dataset.packageTab;

    tabs.forEach((option) => {
      const selected = option === tab;
      option.setAttribute('aria-selected', String(selected));
      option.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.packagePanel !== packageId;
    });

    if (moveFocus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectPackage(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;

      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;

      event.preventDefault();
      selectPackage(tabs[nextIndex], true);
    });
  });
};

const initializeContactForm = () => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector('[data-contact-status]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const name = String(formData.get('name')).trim();
    const email = String(formData.get('email')).trim();
    const subject = String(formData.get('subject')).trim();
    const message = String(formData.get('message')).trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = new URL('mailto:inquirewingsandchops@gmail.com');

    mailto.searchParams.set('subject', subject);
    mailto.searchParams.set('body', body);
    status.textContent = 'Opening your email app. Review and send the prepared message there.';
    window.location.href = mailto.toString();
  });
};

const initializeInteractiveProducts = () => {
  initializeFlavorExplorer();
  initializeProductExplorer();
  initializePackageSelector();
  initializeContactForm();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeInteractiveProducts, { once: true });
} else {
  initializeInteractiveProducts();
}
