const modal = document.getElementById("imageModal");
const modalOverlay = document.querySelector(".modal-overlay");
const modalClose = document.getElementById("modalClose");

const galleryBtn = document.querySelector(".gallery-button");

const desktopGallery = document.getElementById("desktopGallery");

const sliderImage = document.getElementById("sliderImage");
const imageCounter = document.getElementById("imageCounter");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let images = [];
let currentIndex = 0;
let isFetchingImages = false;
let savedScrollY = 0;
let touchStartX = 0;
let touchStartY = 0;
const imageEndpoints = ["/images", "http://localhost:3000/images"];

/* fetch images */

async function fetchImages() {
  if (images.length || isFetchingImages) return images;

  isFetchingImages = true;

  try {
    const response = await fetchImageList();

    images = response.images;

    updateGalleryButtonCount();
  } catch (error) {
    console.error("Failed to fetch images:", error);
    images = [];
  } finally {
    isFetchingImages = false;
  }

  return images;
}

async function fetchImageList() {
  const errors = [];

  for (const endpoint of imageEndpoints) {
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Image request failed with status ${response.status}`);
      }

      const data = await response.json();
      const baseUrl = response.url;
      const fetchedImages = Array.isArray(data)
        ? data.map((src) => new URL(src, baseUrl).href)
        : [];

      return { images: fetchedImages };
    } catch (error) {
      errors.push(error.message);
    }
  }

  throw new Error(errors.join(" | "));
}

/* open modal */

async function openModal(e) {
  e.preventDefault();

  currentIndex = 0;
  openModalShell();
  renderLoadingState();

  await fetchImages();

  renderDesktopGallery();
  renderMobileImage();
}

function openModalShell() {
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");

  savedScrollY = window.scrollY;
  document.body.classList.add("modal-open");
  document.body.style.top = `-${savedScrollY}px`;
}

/* close modal */

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");
  document.body.style.top = "";

  window.scrollTo(0, savedScrollY);
}

/* desktop gallery */

function renderDesktopGallery() {
  desktopGallery.innerHTML = "";

  if (!images.length) {
    renderGalleryMessage("No property images are available right now.");
    return;
  }

  images.forEach((img) => {
    const image = document.createElement("img");

    image.src = img;
    image.alt = "Property image";
    image.loading = "lazy";

    desktopGallery.appendChild(image);
  });
}

function renderLoadingState() {
  desktopGallery.innerHTML = "";
  renderGalleryMessage("Loading property images...");
  sliderImage.removeAttribute("src");
  sliderImage.alt = "Loading property image";
  imageCounter.textContent = "Loading";
}

function renderGalleryMessage(message) {
  desktopGallery.innerHTML = "";

  const messageElement = document.createElement("p");
  messageElement.className = "gallery-message";
  messageElement.textContent = message;

  desktopGallery.appendChild(messageElement);
}

/* mobile slider */

function renderMobileImage(direction = "") {
  if (!images.length) {
    sliderImage.removeAttribute("src");
    sliderImage.alt = "No property images are available";
    imageCounter.textContent = "0 / 0";
    return;
  }

  if (direction) {
    sliderImage.classList.remove("slide-next", "slide-prev");
    sliderImage.offsetWidth;
    sliderImage.classList.add(direction);
  }

  sliderImage.src = images[currentIndex];
  sliderImage.alt = `Property image ${currentIndex + 1}`;

  imageCounter.textContent = `${currentIndex + 1} / ${images.length}`;
}

/* next prev */

function nextImage() {
  if (!images.length) return;

  currentIndex++;

  if (currentIndex >= images.length) {
    currentIndex = 0;
  }

  renderMobileImage("slide-next");
}

function prevImage() {
  if (!images.length) return;

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = images.length - 1;
  }

  renderMobileImage("slide-prev");
}

/* touch swipe */

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}

function handleTouchEnd(e) {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const xDiff = touchStartX - touchEndX;
  const yDiff = touchStartY - touchEndY;
  const minSwipeDistance = 45;

  if (Math.abs(xDiff) <= Math.abs(yDiff) || Math.abs(xDiff) < minSwipeDistance) {
    return;
  }

  if (xDiff > 0) {
    nextImage();
  } else {
    prevImage();
  }
}

function updateGalleryButtonCount() {
  const label = galleryBtn.querySelector("span");

  if (label && images.length) {
    label.textContent = `View all images (${images.length})`;
  }
}


if (galleryBtn && modal && modalOverlay && modalClose) {
  galleryBtn.addEventListener("click", openModal);

  modalClose.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", closeModal);

  nextBtn.addEventListener("click", nextImage);

  prevBtn.addEventListener("click", prevImage);

  sliderImage.addEventListener("touchstart", handleTouchStart, { passive: true });
  sliderImage.addEventListener("touchend", handleTouchEnd, { passive: true });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeModal();
    }

    if (e.key === "ArrowRight") {
      nextImage();
    }

    if (e.key === "ArrowLeft") {
      prevImage();
    }
  });
}
