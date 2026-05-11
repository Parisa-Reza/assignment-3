const propertiesGrid = document.getElementById("propertiesGrid");
const propertySort = document.getElementById("propertySort");

/* device limit tracking*/

function getLimit() {

    if (window.innerWidth <= 768) {
        return 4;
    }

    return 6;
}


function buildApiUrl(sortType) {

    const limit = getLimit();

    return `http://localhost:3000/get-property?${sortType}=true&limit=${limit}`;
}


async function fetchProperties(sortType = "most-popular") {

    try {

        propertiesGrid.innerHTML = `
            <div class="loader">
                Loading properties...
            </div>
        `;

        const response = await fetch(buildApiUrl(sortType));

        const data = await response.json();

        if (!data.success) {
            throw new Error("Failed to fetch properties");
        }

        renderProperties(data.Items);
        applyFavoritesUI();

    } catch (error) {

        propertiesGrid.innerHTML = `
            <div class="loader">
                Failed to load properties
            </div>
        `;

        console.error(error);
    }
}


function renderProperties(properties) {

    propertiesGrid.innerHTML = "";

    properties.forEach((item) => {

        const property = item.Property;
        const geo = item.GeoInfo;
        const partner = item.Partner;
        const imageUrl =
            `https://beta.imgservice.rentbyowner.com/640x300/${property.FeatureImage}`;

        /* AMENITIES */
        const amenities = property.TopAmenities
            .slice(0, 3)
            .map((amenity) => amenity.Name)
            .join(" · ");

        /* CARD */
        const card = `
            <article class="property-card">

                <figure class="property-image-wrapper">

                    <div class="property-icons">
                    <button class="icon-btn message-btn"><i class="fa-solid fa-comment-dots"></i></button>
                    <button class="icon-btn map-btn"><i class="fa-solid fa-location-dot"></i></button>
                    <button class="icon-btn favorite-btn" data-id="${item.ID || ''}">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    </div>

                    <img
                        src="${imageUrl}"
                        alt="${property.PropertyName}"
                    >

                    <figcaption class="price-tag">
                        From $${property.Price.toLocaleString()}
                    </figcaption>

                </figure>

                <div class="property-content">

                    <div class="property-type-row">

                        <span>
                            ${property.ReviewScore} ★
                        </span>
                        <span>
                            ${property.PropertyType}
                        </span>

                    </div>

                    <h3 class="property-title">
                        ${property.PropertyName}
                    </h3>

                    <p class="property-amenities">
                        ${amenities}
                    </p>

                    <p class="property-location">
                        ${geo.City} > ${geo.Country}
                    </p>

                    <div class="card-footer">

                        <span class="partner-name">
                            ${getPartnerName(partner.URL)}
                        </span>

                        <a
                            href="${partner.URL}"
                            target="_blank"
                            class="availability-btn"
                        >
                            View Availability
                        </a>

                    </div>

                </div>

            </article>
        `;

        propertiesGrid.insertAdjacentHTML("beforeend", card);
    });
}

function getPartnerName(url) {

    if (url.includes("booking")) {
        return "Booking.com";
    }

    if (url.includes("vrbo")) {
        return "Vrbo";
    }

    if (url.includes("expedia")) {
        return "Expedia";
    }

    return "Partner";
}


propertySort.addEventListener("change", (event) => {

    const selectedValue = event.target.value;

    fetchProperties(selectedValue);
});

/* initial load by default most popular*/

window.addEventListener("DOMContentLoaded", () => {

    fetchProperties("most-popular");
});

/* refetching while resizing the screen*/

let resizeTimer;

window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

        fetchProperties(propertySort.value);

    }, 500);
});


document.addEventListener('DOMContentLoaded', () => {

    const propertiesGrid = document.getElementById("propertiesGrid");

    const STORAGE_KEY = "my_favorite_properties";

    function getFavorites() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function saveFavorites(favs) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    }



    function toggleFavorite(btn) {
        const propertyId = btn.getAttribute("data-id");

        if (!propertyId) return; // prevent undefined bugs

        let favorites = getFavorites();

        const index = favorites.indexOf(propertyId);

        const icon = btn.querySelector("i");

        if (index > -1) {
            favorites.splice(index, 1);
            btn.classList.remove("active");
            icon.classList.replace("fa-solid", "fa-regular");
            icon.style.color = "";
        } else {
            favorites.push(propertyId);
            btn.classList.add("active");
            icon.classList.replace("fa-regular", "fa-solid");
            icon.style.color = "red";
        }

        saveFavorites(favorites);
    }


    // event delegation
    propertiesGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.favorite-btn');
        if (!btn) return;

        e.preventDefault();
        toggleFavorite(btn);
    });

    // restore UI after render
    window.applyFavoritesUI = () => {
        const favorites = getFavorites();

        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const id = btn.dataset.id;
            const icon = btn.querySelector('i');

            if (favorites.includes(id)) {
                btn.classList.add('active');
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = 'red';
            }
        });
    };

});



function applyFavoritesUI() {
    const favorites = getFavorites();

    document.querySelectorAll(".favorite-btn").forEach(btn => {
        const id = btn.getAttribute("data-id");
        const icon = btn.querySelector("i");

        if (!id) return;

        if (favorites.includes(id)) {
            btn.classList.add("active");
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
            icon.style.color = "red";
        }
    });
}