
// Store our API endpoint inside queryUrl
var link = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=" +
  "2019-01-08&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// create empty list 
let circles = [];
let magnitudes = [];
let geojson ;

d3.json(link, function(data){
    createFeatures(data.features);
    
})
// create marker size
function markerSize(mag) {
    return mag * 20000;
  }

  // create function to choose colour according to mag
function markerColor(mag) {
  let color = "purple";
  
  if (mag<= 1 ) {
    color = "peach"
  }
  else if (mag>1 && mag<=2) {
    color = "yellow"
  }
  else if (mag>2 && mag <=3) {
    color = "orange"
  }
  else if (mag>3 && mag <=4) {
    color = "red"
  }
  else if (mag>4 && mag <=5) {
    color = "violet"
  }
  else if (mag > 5) {
    color = "black"
  }
  return color
} 
function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      
        let lats = feature.geometry.coordinates[1];
        let longs = feature.geometry.coordinates[0]
    
        magnitudes =   feature.properties.mag;

        circles.push(
          L.circle([lats, longs], {
            stroke: false,
            fillOpacity: 0.75,
            color: "black",
            fillColor: markerColor(feature.properties.mag),
            radius: markerSize(feature.properties.mag)
          }).bindPopup("<h3>" + feature.properties.place +
              
          "  Magnitude : " +  feature.properties.mag + "</p>")
        );

        
  
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
    
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

function createMap(earthquakes){


    // Define streetmap and darkmap layers
    const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token={accessToken}", {
        accessToken: API_KEY
      });
    
    const darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token={accessToken}", {
        accessToken: API_KEY
      });
    
    // Define a baseMaps object to hold our base layers
    const baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };

    // Add all the earthquakeMarkers to a new layer group.
    // Now we can handle them as one group instead of referencing each individually
    const quakeLayer = L.layerGroup(circles);

    
    const overlayMaps = {
      "markers" : earthquakes,
      "earthquakes" : quakeLayer
    }
    
    // Create a new maps
    const myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, quakeLayer]
    });

    
    // Create a layer control containing our baseMaps
    // add an overlay Layer containing the earthquake GeoJSON
    L.control.layers(baseMaps,overlayMaps,quakeLayer, {
      collapsed: false
    }).addTo(myMap);
    
    const legend = L.control({ position: "bottomright" });
 
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");
        
        const grades = [0,1,2,3,4,5];
        let labels = [];

      
        for (var i = 0; i < grades.length; i++) {
              div.innerHTML += 
                  '<li style="background:' + markerColor(grades[i + 1] ) + '">' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1]  : '+' + '</li> ' 
                  ) 
                
                }
        
        return div;
      };
      // Adding legend to the map
      legend.addTo(myMap);


    }
