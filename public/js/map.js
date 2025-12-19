locationiq.key = mapToken;

// Create the map using maplibre-gl
var map = new maplibregl.Map({
    container: 'map',
    style: locationiq.getLayer('Streets'),
    zoom: 8,
    center: coordinates // [longitude, latitude]
});

// Set default language to English
map.setLanguage('en');

// Add event listener to change language
document.getElementById('lang-options').addEventListener('change', function(event) {
    let selectedLang = event.target.value;
    map.setLanguage(selectedLang, selectedLang !== 'en');
});

// Coordinates (you are getting it from server)
console.log(coordinates); // Example: [longitude, latitude]

// Create a marker at the coordinates
new maplibregl.Marker({
    color: "red", // You can set marker color
})
    .setLngLat(coordinates) // [longitude, latitude]
    .addTo(map);