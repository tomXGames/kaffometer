var maxI = 200, rad = 21, opac = .6;
var map, heatmap;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat:  46.8007, lng:  8.2227 },
    zoom: 8,
  });
  fetch('public-transport-ch.geojson').then(function(response) {
    response.json().then(function(result) {
      let locations = result.features.map((val) => {
        if(val.geometry.type == "Point"){   //type is point
          if(val.geometry.coordinates[0] == val.geometry.coordinates[1]) console.log(val)
          return new google.maps.LatLng( parseFloat(val.geometry.coordinates[1]), parseFloat(val.geometry.coordinates[0]));
        }
        else if(val.geometry.type == "LineString"){  //type is polygon
          var x = 0, y= 0;
          val.geometry.coordinates.forEach(coords => {
            x += parseFloat(coords[0]);
            y += parseFloat(coords[1]);
          });
          if(y/val.geometry.coordinates.length== x/val.geometry.coordinates.length) console.log(val);
          return new google.maps.LatLng(y / val.geometry.coordinates.length, x/ val.geometry.coordinates.length );
        }
        else if(val.geometry.type == "Poylgon"){
          var x = 0, y= 0;
          val.geometry.coordinates[0].forEach(coords => {
            x += parseFloat(coords[0]);
            y += parseFloat(coords[1]);
          });
          if(y/val.geometry.coordinates.length== x/val.geometry.coordinates.length) console.log(val);
          return new google.maps.LatLng(y / val.geometry.coordinates.length, x/ val.geometry.coordinates.length );
        }
        else if (val.geometry.type == "MultiPolygon"){  // Type is MultiPolygon
          var x=0, y=0;
          val.geometry.coordinates.forEach(shape => {
            shape.forEach((points) => {
              length += points.length;
              points.forEach((coords)=>{
                x += parseFloat(coords[0]);
                y += parseFloat(coords[1]);
              })
            });
          });
          if(y/length== x/length) console.log(val);
          return new google.maps.LatLng(y/length, x/length);
        }
        else{
          console.error("Couldn't deserialize following object: ", val)
        }
      });


      heatmap = new google.maps.visualization.HeatmapLayer({
        data: locations,
        maxI: 1000000,
        
      });


      heatmap.setMap(map);
    });
  });
}