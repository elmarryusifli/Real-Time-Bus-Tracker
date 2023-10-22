// Define a global variable for the map
let map;

// Define an array to store the markers
const markers = [];

// Initialize the map
function initMap() {
    // Define the coordinates for your map's center
    const mapCenter = { lat: 42.365554, lng: -71.104081 }; // San Francisco

    // Create a new map instance
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 14 // You can adjust the zoom level
    });

    // Call the move function here
    move();
}

// Define your move function
function move() {
    // Fetch bus locations
    getBusLocations()
        .then((locations) => {
            // Clear existing markers
            clearMarkers();

            // Create markers for each bus
            locations.forEach((location) => {
                createMarker(location);
            });

            // Schedule the next update
            setTimeout(move, 15000);
        })
        .catch((error) => {
            console.error(error);
        });
}

// Create a marker for a bus and add it to the markers array
function createMarker(location) {
    const marker = new google.maps.Marker({
        position: { lat: location[1], lng: location[0] },
        map: map,
        title: 'Bus Marker'
    });

    // Add the marker to the markers array
    markers.push(marker);
}

// Clear all existing markers from the map
function clearMarkers() {
    markers.forEach((marker) => {
        marker.setMap(null); // Removes the marker from the map
    });

    // Clear the markers array
    markers.length = 0;
}

async function getBusLocations() {
    const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    const response = await fetch(url);
    const json = await response.json();

    // Extract the bus locations and set them to the global busStops variable
    const busStops = json.data.map((bus) => [bus.attributes.longitude, bus.attributes.latitude]);
    return busStops;
}

// Initial call to start the process
move();
