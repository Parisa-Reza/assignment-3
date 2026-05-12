let map;
let markers = [];
let properties = [];
let apiKey = "";

// Initialize map when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch the API key from server
    const response = await fetch("http://localhost:3000/get-api-key");
    const data = await response.json();
    apiKey = data.googleMapsApiKey;

    if (!apiKey) {
      showMapError("Map configuration needed");
      return;
    }

    // Load the Google Maps API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", initMap);
    script.addEventListener("error", () => {
      console.error("Failed to load Google Maps API");
      showMapError("Failed to load map");
    });
    document.head.appendChild(script);
  } catch (error) {
    console.error("Error fetching API key:", error);
    showMapError("Configuration error");
  }
});

function initMap() {
  const mapContainer = document.getElementById("propertiesMap");
  
  if (!mapContainer) {
    console.error("Map container not found");
    return;
  }

  // Default center (will be updated based on properties)
  const defaultCenter = { lat: 30.224107, lng: -85.887897 };

  map = new google.maps.Map(mapContainer, {
    zoom: 20,
    center: defaultCenter,
    mapTypeControl: true,
    fullscreenControl: true,
  });

  // Listen for property updates
  observePropertiesGrid();
}

function observePropertiesGrid() {
  const propertiesGrid = document.getElementById("propertiesGrid");
  
  if (!propertiesGrid) {
    console.error("Properties grid not found");
    return;
  }

  // Watch for changes to the properties grid
  const observer = new MutationObserver(() => {
    updateMapMarkers();
  });

  observer.observe(propertiesGrid, {
    childList: true,
    subtree: true,
  });

  // Initial update
  updateMapMarkers();
}

async function updateMapMarkers() {
  // Clear existing markers
  markers.forEach((marker) => marker.setMap(null));
  markers = [];

  const propertyCards = document.querySelectorAll(".property-card");
  
  if (propertyCards.length === 0) {
    console.log("No properties to display on map");
    return;
  }

  let bounds = new google.maps.LatLngBounds();
  let hasValidLocations = false;

  propertyCards.forEach((card, index) => {
    // Extract property data from card
    const title = card.querySelector(".property-title")?.textContent || "Property";
    const location = card.querySelector(".property-location")?.textContent || "";
    const price = card.querySelector(".price-tag")?.textContent || "";
    
    // Get latitude and longitude - these should be in data attributes
    // We need to modify propertyCard.js to add these attributes
    const lat = parseFloat(card.dataset.latitude);
    const lng = parseFloat(card.dataset.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      hasValidLocations = true;
      const position = { lat, lng };
      bounds.extend(position);

      // Create marker
      const marker = new google.maps.Marker({
        position,
        map,
        title,
        label: (index + 1).toString(),
      });

      // Store reference to card with marker
      marker.cardElement = card;
      markers.push(marker);

      // Create info window
      const infoContent = `
        <div class="map-info-window">
          <h3>${title}</h3>
          <p>${location}</p>
          <p><strong>${price}</strong></p>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoContent,
      });

      // Marker click handler
      marker.addListener("click", () => {
        // Close all other info windows
        document.querySelectorAll(".gm-ui-hover-effect").forEach(el => {
          if (el.dataset.infoWindowOpen) {
            // InfoWindow will be handled by the click listener
          }
        });

        infoWindow.open(map, marker);
        highlightPropertyCard(card);
        map.setCenter(position);
        map.setZoom(15);
      });

      // Hover effects
      marker.addListener("mouseover", () => {
        highlightPropertyCard(card);
        marker.setIcon(getHighlightedMarkerIcon());
      });

      marker.addListener("mouseout", () => {
        removeHighlightPropertyCard(card);
        marker.setIcon(null); // Reset to default
      });

      // Add hover listener to card
      card.addEventListener("mouseenter", () => {
        highlightMarker(marker);
      });

      card.addEventListener("mouseleave", () => {
        removeHighlightMarker(marker);
      });

      // Add click listener to card to center map on marker
      const viewAvailabilityBtn = card.querySelector(".availability-btn");
      if (viewAvailabilityBtn) {
        viewAvailabilityBtn.addEventListener("click", (e) => {
          e.preventDefault();
          map.setCenter(position);
          map.setZoom(15);
          infoWindow.open(map, marker);
          window.open(viewAvailabilityBtn.href, "_blank");
        });
      }
    }
  });

  // Adjust map bounds to fit all markers
  if (hasValidLocations && markers.length > 0) {
    map.fitBounds(bounds, { padding: 100 });
  } else if (!hasValidLocations) {
    console.warn("No valid location data found for properties");
    showMapError("Properties location data not available");
  }
}

function highlightPropertyCard(card) {
  card.classList.add("property-card-highlighted");
}

function removeHighlightPropertyCard(card) {
  card.classList.remove("property-card-highlighted");
}

function highlightMarker(marker) {
  marker.setIcon(getHighlightedMarkerIcon());
  if (marker.cardElement) {
    highlightPropertyCard(marker.cardElement);
  }
}

function removeHighlightMarker(marker) {
  marker.setIcon(null); // Reset to default
  if (marker.cardElement) {
    removeHighlightPropertyCard(marker.cardElement);
  }
}

function getHighlightedMarkerIcon() {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 12,
    fillColor: "#637ae2",
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 2,
  };
}

function showMapError(message) {
  const mapContainer = document.getElementById("propertiesMap");
  if (mapContainer) {
    mapContainer.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: #f5f5f5;
        color: #666;
        border-radius: 1rem;
        text-align: center;
        padding: 2rem;
      ">
        <div>
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">⚠️ ${message}</p>
          <p style="font-size: 0.9rem; color: #999;">Please check the server configuration</p>
        </div>
      </div>
    `;
  }
}
