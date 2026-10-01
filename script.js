document.querySelectorAll(".screenshots").forEach((carousel, carouselIndex) => {
  const slides = [...carousel.querySelectorAll(":scope > a")];

  carousel.setAttribute("role", "region");
  carousel.setAttribute("aria-roledescription", "carousel");

  const projectTitle = carousel.closest("article")?.querySelector("h3")?.textContent;
  carousel.setAttribute("aria-label", `${projectTitle || `Project ${carouselIndex + 1}`} images`);

  slides.forEach((slide, index) => {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${index + 1} of ${slides.length}`);
  });

  if (slides.length < 2) return;

  let currentSlide = 0;
  const controls = document.createElement("div");
  controls.className = "carousel-controls";

  const previousButton = document.createElement("button");
  previousButton.className = "carousel-button";
  previousButton.type = "button";
  previousButton.setAttribute("aria-label", "Previous image");
  previousButton.textContent = "←";

  const status = document.createElement("span");
  status.className = "carousel-status";
  status.setAttribute("aria-live", "polite");

  const nextButton = document.createElement("button");
  nextButton.className = "carousel-button";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Next image");
  nextButton.textContent = "→";

  controls.append(previousButton, status, nextButton);

  const dots = document.createElement("div");
  dots.className = "carousel-dots";
  dots.setAttribute("aria-label", "Choose image");

  const dotButtons = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show image ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dots.append(dot);
    return dot;
  });

  carousel.append(controls, dots);

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== currentSlide;
    });
    dotButtons.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", dotIndex === currentSlide ? "true" : "false");
    });
    status.textContent = `${currentSlide + 1} / ${slides.length}`;
  }

  previousButton.addEventListener("click", () => showSlide(currentSlide - 1));
  nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentSlide - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentSlide + 1);
    }
  });

  showSlide(0);
});

const lightbox = document.createElement("dialog");
lightbox.className = "lightbox";
lightbox.setAttribute("aria-label", "Expanded project image");
lightbox.innerHTML = `
  <div class="lightbox-content">
    <button class="lightbox-close" type="button" aria-label="Close image viewer">&times;</button>
    <img class="lightbox-image" alt="">
    <p class="lightbox-caption"></p>
  </div>
`;
document.body.append(lightbox);

const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const lightboxClose = lightbox.querySelector(".lightbox-close");

document.querySelectorAll(".screenshots > a").forEach((imageLink) => {
  imageLink.addEventListener("click", (event) => {
    event.preventDefault();
    const thumbnail = imageLink.querySelector("img");
    lightboxImage.src = imageLink.href;
    lightboxImage.alt = thumbnail?.alt || "Expanded project image";
    lightboxCaption.textContent = thumbnail?.alt || "";
    lightbox.showModal();
  });
});

function closeLightbox() {
  lightbox.close();
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
});
