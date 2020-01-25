// Perform an API call to the USGS API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);

 // Define function to create the circle radius based on the magnitude
function circleSize(magnitude) {
  return magnitude * 40000;
}

// Define function to set the circle color based on the magnitude
function circleColor(magnitude) {
  if (magnitude < 1) {
    return "#FEB24C"
  }
  else if (magnitude < 2) {
    return "#FD8D3C"
  }
  else if (magnitude < 3) {
    return "#FC4E2A"
  }
  else if (magnitude < 4) {
    return "#E31A1C"
  }
  else if (magnitude < 5) {
    return "#BD0026"
  }
  else {
    return "#7a0177"
  }
}

// create function for creating circle markers
function createMarkers(response) {
  
  // Pull the event data
  var earthquakes = response.features;
  // console.log(earthquakes)

  // Initialize an array to hold quake markers
  var quakeMarkers = [];

  // loop to grab data for each marker
  for (var i = 0; i < earthquakes.length; i++) {
    var earthquake = earthquakes[i];
    var magnitude = earthquake.properties.mag; 
    // console.log(magnitude);

    // Adding circular markers + popups 
   var quakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {    
      fillOpacity: 0.75,
      color: "white",
      fillColor: circleColor(magnitude),
      radius: circleSize(magnitude)
    }).bindPopup("<h1>" + earthquake.properties.place + "</h1> <hr> <h3>Magnitude: " + magnitude + "</h3>"); 
     
  // test line for markers
  //  var quakeMarker = L.marker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]])
  //  .bindPopup("<h1>" + earthquake.properties.place + "</h1> <hr> <h3>Magnitude: " + magnitude + "</h3>"); 

    // Add the marker to the quakeMarkers array
    quakeMarkers.push(quakeMarker);
    // console.log(quakeMarker);
  }

  // Create a layer group made from the quake markers array, pass it into the createMap function
  createMap(L.layerGroup(quakeMarkers));
  
}

//  map function
function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // add secondary satellit tile layer
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  
  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap,
    "Satellite Map": satellitemap
  };

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map", {
    center: [26.726017, -1.082667],
    zoom: 3,
    layers: [satellitemap, lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  //create function to get colors for legend
  function getColor(d) {
    return d > 5 ? "#7a0177" :
            d > 4 ? "#BD0026" :
            d > 3 ? "#E31A1C" :
            d > 2 ? "#FC4E2A" :
            d > 1 ? "#FD8D3C" :
            d > 0 ? "#FEB24C" :
            "#FED976";
  }

    // create legend for map
    var legend = L.control({position: "bottomright"});
  
    legend.onAdd = function (map) { 
  
      var div = L.DomUtil.create("div", "info legend"),
        mags = [0, 1, 2, 3, 4, 5];
  
      // loop for legend 
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
        '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
        mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
  
      return div;
  
    };
  
  legend.addTo(map)

}