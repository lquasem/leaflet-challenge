// Store our API endpoint inside queryUrl
var link = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

 


// Create our map, giving it the streetmap and earthquakes layers to display on load

  var map = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
  });

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);



  function chooseColor(mag) {
    var color = "";
    if (mag > 5) {
      color = "Black";
    }
    else if (mag <= 5 && mag > 4) {
      color = "Grey";
    }
    else if (mag <= 4 && mag > 3) {
      color = "Violet";
    }
    else if (mag <= 3 && mag > 2) {
      color = "Orange";
    }
    else if (mag <= 2 && mag > 1) {
      color = "Yellow";
    }
    else {
      color = "Peach";
    }
    return color;
  }

  function markerSize(mag) {
    return mag * 25000;
  }

  function createFeatures(earthquakeData) {
  

  d3.json( link, function(data){
      console.log(data)

      L.geoJson(data, {
          pointToLayer:function(feature, latlng){
         return L.circleMarker(latlng), {
         stroke: false,
         fillOpacity: 0.75,
      color: "black",
      fillColor: chooseColor(feature.properties.mag),
      radius: markerSize(feature.properties.mag) 
         }.bindPopup("<h3>" + feature.properties.place +
       "  Mag: " +  feature.properties.mag + "</p>")
      },
    })


  }).addTo(map);
 
  
  };
  
