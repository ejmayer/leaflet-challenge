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

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 4,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

  
function createMarkers(response) {
  
  // Pull the event data
  var earthquakes = response.features;
  console.log(earthquakes)


  // create markers
  // Initialize an array to hold quake markers
  var quakeMarkers = [];

  for (var i = 0; i < earthquakes.length; i++) {
    var earthquake = earthquakes[i];
    var magnitude = earthquake.properties.mag; 

    console.log(magnitude);

    // Adding circular markers + popups 
    quakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      fillcolor: "white",
      // fillColor: circleColor(+magnitude),
      radius: magnitude * 500
    });
    
    // .bindPopup("<h1>" + earthquake.properties.place + "</h1> <hr> <h3>Magnitude: " + magnitude + "</h3>").addTo(map).addTo(map); 

    // Add the marker to the quakeMarkers array
    quakeMarkers.push(quakeMarker);

    console.log(quakeMarkers);
  };

  // Create a layer group made from the quake markers array, pass it into the createMap function
  createMap(L.layerGroup(quakeMarkers));
  
}


// Perform an API call to the USGS API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", createMarkers);