const images = [
    { src: "https://source.unsplash.com/random/600x400/?nature", category: "nature" },
    { src: "https://source.unsplash.com/random/600x400/?city", category: "city" },
    { src: "https://source.unsplash.com/random/600x400/?animals", category: "animals" },
    { src: "https://source.unsplash.com/random/600x400/?mountain", category: "nature" },
    { src: "https://source.unsplash.com/random/600x400/?building", category: "city" },
    { src: "https://source.unsplash.com/random/600x400/?dog", category: "animals" },
    { src: "https://source.unsplash.com/random/600x400/?forest", category: "nature" },
    { src: "https://source.unsplash.com/random/600x400/?street", category: "city" },
];

const gallery = document.querySelector(".gallery");
const filterButtons = document.querySelectorAll(".filter-btn");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close-btn");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const downloadBtn = document.getElementById("download-btn");
const searchInput = document.getElementById("search-input");
const backToTopBtn = document.querySelector(".back-to-top");

let currentImageIndex = 0;
let currentFilter = "all";
let visibleImages = 8;

function loadImages(filter = "all", loadMore = false) {
    if (!loadMore) {
        gallery.innerHTML = "";
        visibleImages = 8;
    }
    const filteredImages = filter === "all" ? images : images.filter(img => img.category === filter);
    const imagesToShow = filteredImages.slice(0, visibleImages);
    
    imagesToShow.forEach((image, index) => {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.setAttribute("data-category", image.category);
        
        const img = document.createElement("img");
        img.src = image.src;
        img.alt = `Image ${index + 1}`;
        img.className = "gallery-img";
        img.loading = "lazy";
        
        galleryItem.appendChild(img);
        gallery.appendChild(galleryItem);

        img.addEventListener("click", () => {
            currentImageIndex = images.findIndex(img => img.src === image.src);
            lightbox.classList.add("active");
            lightboxImg.src = image.src;
            downloadBtn.href = image.src;
            downloadBtn.setAttribute("download", `image-${currentImageIndex + 1}.jpg`);
        });
    });
}

// Event Listeners
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentFilter = button.dataset.filter;
        loadImages(currentFilter);
    });
});

closeBtn.addEventListener("click", () => lightbox.classList.remove("active"));
prevBtn.addEventListener("click", () => navigate(-1));
nextBtn.addEventListener("click", () => navigate(1));

function navigate(direction) {
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    lightboxImg.src = images[currentImageIndex].src;
    downloadBtn.href = images[currentImageIndex].src;
    downloadBtn.setAttribute("download", `image-${currentImageIndex + 1}.jpg`);
}

searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredImages = images.filter(img => 
        img.category.includes(searchTerm) || 
        img.src.toLowerCase().includes(searchTerm)
    );
    gallery.innerHTML = "";
    filteredImages.forEach((image, index) => {
        // Same image creation code as in loadImages()
    });
});

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        visibleImages += 4;
        loadImages(currentFilter, true);
    }
    backToTopBtn.classList.toggle("visible", window.scrollY > 300);
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("active")) {
        if (e.key === "Escape") lightbox.classList.remove("active");
        else if (e.key === "ArrowLeft") navigate(-1);
        else if (e.key === "ArrowRight") navigate(1);
    }
});

loadImages();