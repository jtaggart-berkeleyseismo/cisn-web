function getURLParameter (name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.search
      ) || [null, ''])[1].replace(/\+/g, '%20')
    ) || null
  );
}

// #####################################################
// Open the double map view
//
function open_leaflet () {
  window.location = './viewLeaflet.html?eventid=' + eventid;
}

// #####################################################
// Open the static map view
//
function open_static () {
  window.location = './view.html?eventid=' + eventid;
}

//  #################################################################
//  #  Make table rows clickable
//  ##################################################################
function initTableClick () {
  $(document).ready(function () {
    $('table tbody tr').click(function () {
      document.location = $(this).data('href');
      return false;
    });
  });
}

//  #################################################################
//  #  Find categories of available products for event
//  ##################################################################
function attr_div(attr_collection) {
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
    return content;
  } catch (err) {
    console.log(err)
  }
}

function col_exp() {
  var col = document.getElementsByClassName("collapsible");
  for (i = 0; i < col.length; i++) {
  
      this.classList.toggle("activeCol");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
   
  };
};
//  #################################################################
//  #  Writing the table
//  ##################################################################
function list_meta(eventid) {
  $.getJSON('./data/' + eventid + '/stationlist.json', function(
    json
  ) {
    var stations = json.features;
    stationsSorted = stations.sort((a, b) => (a.properties.distance > b.properties.distance) ? 1 : -1);
    return_data(stationsSorted);
  });
function return_data(stations) {
  var dontUseStationType = 'macroseismic';
  var htmlCode = '<h2 style="text align:center;"><b>Seismic Stations</b></h2><br/>';
  for (var i=0; i<stations.length; i++) {
    if (stations[i].properties.station_type != dontUseStationType) {
      coordinates = stations[i].geometry.coordinates;
      htmlCode = htmlCode + '<table  style="text-align:left;'+ intColors[Math.round(stations[i].id)]+'"><b><tr><td><b>'+ stations[i].id +'</b></td><td>&emsp;&emsp;&emsp;&emsp;</td>'+ '</b><td><b>' + stations[i].properties.name + '</b></td></tr></table>'
                + '<table ><tr><td>&emsp;&emsp; <b>Lat: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</b>' + coordinates[0]
                + '</td><td>&emsp;&emsp; <b> Long:&emsp;&emsp;&emsp;</b>' + coordinates[1]
         + '</td><td> &emsp;&emsp;<b> Source:&emsp;&emsp;&emsp;</b>' + stations[i].properties.source
                 + '</td><td>&emsp;&emsp;<b>Intensity: &emsp;&emsp;&emsp;</b>' + stations[i].properties.intensity+'</td></tr>'+'<br/>'
             + '<tr><td>&emsp;&emsp;<b> Distance (km): &emsp;&emsp;</b>' + stations[i].properties.distance
                     + '</td><td>&emsp;&emsp;<b> PGA (%g): &emsp;&nbsp</b>' + stations[i].properties.pga
                     + '</td><td>&emsp;&emsp;<b> PGV (cm/s)&emsp; </b>' + stations[i].properties.pgv
        
                + '</td><td>&emsp;&emsp;<b> Vs30 (m/s):&emsp;&nbsp;&nbsp;&nbsp;</b>' + stations[i].properties.vs30 + '</td></tr></table><br/>'
      htmlCode = htmlCode +'<table ><tr><td><b>Station Comp &emsp;&emsp;&emsp;&emsp;</b></td><td><b> PGA (%g) &emsp;&emsp;&emsp;&emsp; </b></td><td><b>PGV (cm/s)&emsp;&emsp;&emsp;&emsp;'+ '</b></td><td><b> SA(0.3) (%g)&emsp;&emsp;&emsp;&emsp;</b></td><td><b> SA(1.0) (%g)&emsp;&emsp;&emsp;&emsp;</b> </td>'+ ' <td><b>SA(3.0) (%g) &emsp;&emsp;&emsp;&emsp;</b></td></tr>'
      channelsVar = stations[i].properties.channels
      for (var j=0; j<channelsVar.length; j++) {
        htmlCode = htmlCode + '<tr><td><b>' + channelsVar[j].name +'</b></td>';
        for (var k=0; k<channelsVar[j].amplitudes.length; k++) {
          htmlCode = htmlCode + '<td>' + channelsVar[j].amplitudes[k].value+'</td>';
        }
      };
      htmlCode = htmlCode + '</tr></table>'+'</br></br></br>';
    };
  };
  document.getElementById('stationTable').innerHTML = htmlCode;
  //col_exp();
};
    // Object.keys(json).forEach(function(key,index) {
    // subMeta = json[key];
    // keyName = key.charAt(0).toUpperCase() + key.slice(1)
    //
    // metaHTML = metaHTML + '<button type="button" class="collapsible"> '
    //   + keyName + '</button><div class="content"><p>';
    //
    // // Object.keys(subMeta).forEach(function(key2,index) {
    // //   // metaHTML = metaHTML + '<br/><b>' + key2 + '</b><br/>' + JSON.stringify(subMeta[key2], null, 4);
    // //   console.log(get_subs(subMeta[key2], metaHTML));
    // // });
    //
    // metaHTML = metaHTML + get_subs(subMeta, 0) + '</p></div>';
    // document.getElementById('metaTable').innerHTML = metaHTML;

  // });

  // col_exp();



};


//  #################################################################
//  #  Main
//  ##################################################################

var eventid = getURLParameter('eventid');

list_meta(eventid);
