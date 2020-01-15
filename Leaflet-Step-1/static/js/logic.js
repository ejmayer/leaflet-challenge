function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map-id", {
      center: [39.828175,-98.579500],
      zoom: 12,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
function createMarkers(response) {
  
    // console.log(response);

    // Pull the event data off of response.data
    var events = response.data.properties;
  
    console.log(events);
  
    // // Initialize an array to hold bike markers
    // var quakeMarkers = [];
  
//     // Loop through the stations array
//     for (var index = 0; index < stations.length; index++) {
//       var station = stations[index];
  
//       // For each station, create a marker and bind a popup with the station's name
//       var bikeMarker = L.marker([station.lat, station.lon])
//         .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "<h3>");
  
//       // Add the marker to the bikeMarkers array
//       bikeMarkers.push(bikeMarker);
//     }
  
//     // Create a layer group made from the bike markers array, pass it into the createMap function
//     createMap(L.layerGroup(bikeMarkers));
   }
  
  
  // Perform an API call to the USGS API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson", createMarkers);