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
    center: [39.828175,-98.579500],
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
  var data = response.features;

  console.log(data.geometry);

  // Initialize an array to hold quake markers
  var quakeMarkers = [];

  // Loop through the earthquakes array
  for (var index = 0; index < data.length; index++) {
    var quakeList = data[index];
    

    // var quakePlaces = [];
    // var quakePlace = data.properties.place;
    // quakePlaces.push(quakePlace);

    // console.log(quakePlace);


    console.log(quakeList);


    // For each quake, create a marker and bind a popup with the quake's location and magnitude
    var quakeMarker = L.marker([quakeList.geometry.coordinates[0],quakeList.geometry.coordinates[1]])
      .bindPopup("<h3>Location:" + quakeList.properties.place + "<h3><h3>Magnitude: " + quakeList.properties.mag + "<h3>");

    // Add the marker to the quakeMarkers array
    quakeMarkers.push(quakeMarker);

    console.log("quakemarkers:"+quakeMarker);
  }

// Create a layer group made from the quake markers array, pass it into the createMap function
createMap(L.layerGroup(quakeMarkers));
  
}


// Perform an API call to the USGS API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", createMarkers);