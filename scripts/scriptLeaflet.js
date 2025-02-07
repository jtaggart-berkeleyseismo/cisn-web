

// ##################################################
// Get event ID from URL
function getURLParameter(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.search
      ) || [null, ''])[1].replace(/\+/g, '%20')
    ) || null
  );
}

var eventid = getURLParameter('eventid');

// #####################################################
// Open the double map view
//
function open_double() {
  window.location = './viewLeaflet2.html?eventid=' + eventid;
}

// #####################################################
// Open the static map view
//
function open_static() {
  window.location = './view.html?eventid=' + eventid;
}

// #####################################################
// Open the download page for event
//
function open_download() {
  window.location = './downloadPage.html?eventid=' + eventid;
}


// #####################################################
// Open the StationList page for event
//




// #####################################################
// Write json attributes to a div

function attr_div(attr_collection, div_id) {
  var content = '';
  try {
    Object.keys(attr_collection).forEach(function(key) {
      if (attr_collection[key].hasOwnProperty('module')) {
        content +=
          '<b>' +
          key +
          ' module:</b> ' +
          attr_collection[key]['module'] +
          '<br/>';

      } else {
        content += '<b>' + key + ':</b> ' + attr_collection[key] + '<br/>';
      }
    });
    document.getElementById(div_id).innerHTML = content;
  } catch (err) {
    console.log(err)
  }
}

function attr_div1(attr_collection, div_id) {
  var content = '';
  try {
    Object.keys(attr_collection).forEach(function() {
      if (attr_collection.hasOwnProperty()) {
        content =
              '<h6>'+ attr_collection + '</h6>'+
          '<br/>';

      } else {
        content = '<table>'+'<tbody>'+'<tr>'+'<td>'+'<b>'+attr_collection + '</b>'+'</td>'+'</tr>'+'</tbody>'+'</table>';
      }
    });
    document.getElementById(div_id).innerHTML = content;
  } catch (err) {
    console.log(err)
  }
}





// ##################################################
// Show fault
function faultSurface() {
  $.getJSON('./data/' + eventid + '/rupture.json', function(
    json
  ) {
    var fault = json.features;
    show_fault(fault);
  });

  function show_fault(fault) {
    // Show fault only if there is more than one point in rupture.json
    if (fault[0].geometry.coordinates[0].constructor === Array) { //check if the fault is an array or a scalar
      var faultLayer = L.geoJSON(fault);
      control.addOverlay(faultLayer, 'Show fault');
    }
  }
}

// ##################################################
// Show stations
 /*function stationList() {
  $.getJSON(
    './data/' + eventid + '/stationlist.json',
    function(json) {
      var stations = json.features;
      show_stations(stations);
    }
  );

  function show_stations (stations) {
    var stations_layer = L.geoJSON (stations, {
      pointToLayer: function (feature, latlng) {
        if (feature.properties.intensity < 5) {
          var result = feature.properties.mmi_from_pgm.filter(obj => {
            return obj.name === 'pga';
          });
          var stationColor = Math.round(result[0].value);
        } else if (feature.properties.intensity >= 5) {
          var result = feature.properties.mmi_from_pgm.filter(obj => {
            return obj.name === 'pgv';
          });
          var stationColor = Math.round(result[0].value);

        } else {
          var stationWidth = 1;
          var stationRadius = 3;
        }
        return new L.shapeMarker (latlng, {
          fillColor: 'black',
          color: intColors_USGS[stationColor] || 'blue',
          shape: 'triangle',
          radius: stationRadius || 5,
          weight: stationWidth || 3
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          'Station: ' +
          feature.properties.code +
          '<br/>Network: ' +
          feature.properties.network +
          '<br/>Distance: ' +
          feature.properties.distance +
          ' km <br/>Intensity: ' +
          feature.properties.intensity +
          '<br/>PGA: ' +
          feature.properties.pga +
          '<br/>PGV: ' +
          feature.properties.pgv +
          '<br/>Vs30: ' +
          feature.properties.vs30 +
          ' m/s'
        );
      }
    });

    control.addOverlay(stations_layer, 'Show stations');
    stations_layer.addTo(mymap);
  }
}
*/

function stationList() {
  $.getJSON(
    './data/' + eventid + '/stationlist.json',
    function(json) {
      var stations = json.features;
      show_stations(stations);
    }
  );

  function show_stations (stations) {
    console.log(stations);
    var stations_layer = L.geoJSON (stations, {
      pointToLayer: function (feature, latlng) {
        if (feature.properties.station_type == 'seismic') {
          if (feature.properties.intensity < 5) {
            var result = feature.properties.mmi_from_pgm.filter(obj => {
              return obj.name === 'pga';
            });
            var stationColor = Math.round(result[0].value);
          } else if (feature.properties.intensity >= 5) {
            var result = feature.properties.mmi_from_pgm.filter(obj => {
              return obj.name === 'pgv';
            });
            var stationColor = Math.round(result[0].value);
          } else {
            var stationWidth = 1;
            var stationRadius = 3;
          }
          var stationShape = 'triangle';
          return new L.shapeMarker (latlng, {
            fillColor: 'black',
            color: intColors_USGS[stationColor] || 'black',
            shape: 'triangle',
            radius: stationRadius || 5,
            weight: stationWidth || 3
          });
        };
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          'Station: ' +
          feature.properties.code +
          '<br/>Network: ' +
          feature.properties.network +
          '<br/>Distance: ' +
          feature.properties.distance +
          ' km <br/>Intensity: ' +
          feature.properties.intensity +
          '<br/>PGA: ' +
          feature.properties.pga +
          '<br/>PGV: ' +
          feature.properties.pgv +
          '<br/>Vs30: ' +
          feature.properties.vs30 +
          ' m/s'
        );
      }
    });

    control.addOverlay(stations_layer, 'Show stations');
    stations_layer.addTo(mymap);
  }
}





// ##################################################
// Show epicenter and write info in sidebar
function event_info() {
  $.getJSON('./data/' + eventid + '/info.json', function(
    json
  ) {
    var info_input = json.input.event_information;
      var info_input1=json.input.event_information.location;
       var info_input2=json.input.event_information.origin_time;  
    epi_lat = info_input.latitude;
    epi_lon = info_input.longitude;
      

    magnitude = info_input.magnitude;
    depth = info_input.depth;

    attr_div(info_input, 'input_content');
        attr_div1(info_input1, 'input_content1');
       attr_div1(magnitude, 'input_content2');
       attr_div1(info_input2, 'input_content3');
        attr_div1(epi_lat, 'input_content4');
       attr_div1(epi_lon, 'input_content5');
      attr_div1(depth, 'input_content6')
      
    attr_div(json.output.uncertainty, 'motions_content');
    attr_div(json.processing.ground_motion_modules, 'processing_content');



    show_epi(epi_lat, epi_lon, magnitude, depth);
  });

  function show_epi(latitude, longitude, magnitude, depth) {
    mymap.setView(new L.LatLng(latitude, longitude), 8);

    var pulsingIcon = L.icon.pulse({
      iconSize: [10, 10],
      color: 'red',
      heartbeat: 3
    });

    L.marker([latitude, longitude], {
      icon: pulsingIcon
    })
      .addTo(mymap)
      .bindPopup('Latitude:' + latitude + '° <br/>Longitude: ' + longitude +
        '° <br/>Magnitude: ' + magnitude + '<br/>Depth: ' + depth + ' km');
  }
}

// ##################################################
// Function call to show contours of PGA, PGV and PSAs on the map

function show_contours(fileName, layerName) {
  $.getJSON(
    './data/' + eventid + '/' +fileName,
    function(json) {
      var contours = json.features;
      plot_contours(contours);
    }
  );

  function plot_contours(contours) {
    var unit = ' %g';
    if (layerName == 'PGV') {
      unit = ' cm/s'
    };
    var contours_layer = L.layerGroup([L.geoJSON(contours, {
      onEachFeature: function (feature, layer) {
        var popupContent = layerName + ': ' + feature.properties.value.toString() + unit;
        layer.bindPopup(popupContent);
      },
      style: function (feature) {
        return {
          color: feature.properties.color,
          weight: feature.properties.weight
        };
      }
    })]);

    var marker_layer = L.geoJSON(contours, {
      onEachFeature: function(feature, layer) {
        for (i = 0; i < feature.geometry.coordinates.length; i++) {
          for (j = 0; j < feature.geometry.coordinates[i].length; j++) {
            if (j % 50 == 0) {
              var marker = L.circleMarker(
                [
                  feature.geometry.coordinates[i][j][1],
                  feature.geometry.coordinates[i][j][0]
                ], {
                  fillColor: '#f03',
                  fillOpacity: 0,
                  radius: 0.1
                }
              ).bindTooltip(feature.properties.value.toString() + unit, {
                permanent: true,
                direction: 'center',
                className: 'my-labels'
              });
              contours_layer.addLayer(marker);
            }
          }
        }
      }
    });

    control.addBaseLayer(contours_layer, layerName);
  }
}

// #########################################################
// Function call to show Intensity contours on the map
function show_intensity() {
  $.getJSON(
    './data/' + eventid + '/cont_mmi.json',
    function(json) {
      var intensity = json.features;
      plot_int(intensity);
    }
  );

  function plot_int (intensities) {
    var intensity_layer = L.geoJSON(intensities, {
      onEachFeature: function (feature, layer) {
        var popupContent = 'Intensity: ' + feature.properties.value;
        layer.bindPopup(popupContent);
      },
      style: function(feature) {
        return {
          color: feature.properties.color,
          weight: 8 / feature.properties.weight, // weights are lower for integer values of intensity in the shakemap output, so here it's reversed to have the weights in integer values higher
          dashArray: lineStyle[feature.properties.value % 1]
        };
      }
    }).addTo(mymap);

    control.addBaseLayer(intensity_layer, 'Intensity-contour');
  }
}

// #######################################################
// Show raster intensity overlay

function intensityOverlay() {
  var imgIntHelper = new Image();

  var height = 0;
  var width = 0;

  var imagePath = './data/' + eventid + '/intensity_overlay.png';
  // var fileIntensity = './data/' + eventid + '/intensity_overlay.pngw'

  $.getJSON('./data/' + eventid + '/overlay.json',
    function(json) {
      imgIntHelper.onload = function() {
        height = imgIntHelper.height;
        width = imgIntHelper.width;

        var lower_right_x = json['dx'] * width + json['upper_left_x'];
        var lower_right_y = json['dy'] * height + json['upper_left_y'];

        var imageBounds = [[json['upper_left_y'], json['upper_left_x']],
                            [lower_right_y, lower_right_x]];

        overlayLayer = L.imageOverlay(imagePath, imageBounds,
          {opacity: 0.3}
        );

        control.addOverlay(overlayLayer, 'Intensity-overlay');
        // console.log(imageBounds)
      }
      imgIntHelper.src = imagePath;
    }
  );
}

// #######################################################
// Add legend to lower left corner of the map

function legend_box() {
  L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
      var img = L.DomUtil.create('img');

      img.src = './data/' + eventid + '/mmi_legend.png';
      // img.style.width = '70%';
      var widthSize = 0.25 * $(window).width();
      img.style.width =  widthSize.toString() + 'px';
      return img;
  },

    onRemove: function(map) {
      // Nothing to do here
    }
  });

  L.control.watermark = function(opts) {
    return new L.Control.Watermark(opts);
  }

  L.control.watermark({ position: 'bottomleft' }).addTo(mymap);
}

// #######################################################
// Drawing the map
// #####################################################

var mymap = L.map('mapid', {
  zoomControl: false
});

var myMapIndex = {
  Map: mymap
};

var control = L.control.layers();


control.addTo(mymap);

L.control.scale({
  position: 'bottomright'
}).addTo(mymap);

L.control
  .zoom({
    position: 'bottomright'
  })
  .addTo(mymap);

/*

var baseLayers = {

};

var overlays = {
    "fault_layer": layer1,
    "fault_layer1": layer2
};
L.control.layers(baseLayers, overlays,{collapsed:false}).addTo(map);


*/





// #####################################################
//  Map used for background


var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}).addTo(mymap);




function map4() {
var fault_layer = L.esri.tiledMapLayer({
  url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/hazfaults2014/MapServer/',
   //url: "https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/",

  maxZoom: 15
})//.addTo(mymap);
         
control.addOverlay(fault_layer,'US Fault');


}


function map5() {
//var fault_layer1 = L.esri.featureLayer({
 // url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/hazfaults2014/MapServer/21',
   //url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/0',
//  maxZoom: 15
//}).addTo(mymap);
    
  
   var fault_layer1 = L.esri.featureLayer({
  	url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/21'})//.addTo(mymap);
   //fault_layer1.collapsed = true;

    
 //fault_layer1.Visible=false;
    //fault_layer1.set("checked", false)
   // fault_layer1.setVisibility(false);
    

    
    
control.addOverlay(fault_layer1, 'Q fault');
    
    
    
    
    

}














/*
function map4() {
var fault_layer = L.esri.imageMapLayer({
  url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/hazfaults2014/MapServer/',
   //url: "https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/",
    
  maxZoom: 15
}).addTo(mymap);
control.addOverlay(fault_layer, 'US Fault');


}*/





/*

function map6() {
//var fault_layer1 = L.esri.featureLayer({
 // url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/hazfaults2014/MapServer/21',
   //url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/0',
//  maxZoom: 15
//}).addTo(mymap);
    
    
   var fault_layer2 = L.esri.featureLayer({
  	url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/21'}).addTo(mymap);
    
control.addOverlay(fault_layer2, 'Fault  Areas');

}

*/

/*

function map5() {
//var fault_layer = L.esri.featureLayer({
 // url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/hazfaults2014/MapServer/',
  // url: "https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/",
    
 
	L.esri.featureLayer({
  	url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/0'}).addTo(mymap);


	L.esri.featureLayer({
  	url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/21'}).addTo(mymap);

	L.esri.featureLayer({
  	url: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/22'}).addTo(mymap);
    
  /*  
    
  maxZoom: 15 

  var fault_Layer1 = new ArcGISImageServiceLayer("https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/", {
          
          opacity: 0.75
        }).addTo(mymap);
control.addOverlay(fault_layer1, 'Q1faults');
        //map.addLayer(fault_Layer1, 'Q1faults');
      
}
  */
   
 



event_info();
show_intensity();
show_contours('cont_pga.json', 'PGA');
show_contours('cont_pgv.json', 'PGV');
show_contours('cont_psa0p3.json', 'PSA 0.3 s');
show_contours('cont_psa1p0.json', 'PSA 1.0 s');
show_contours('cont_psa3p0.json', 'PSA 3.0 s');
stationList();



faultSurface();
intensityOverlay();
legend_box();
map4();
map5();

var sidebar = L.control.sidebar('sidebar').addTo(mymap);
