var maxI = 200, rad = 21, opac = .6;
var map, heatmap;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat:  46.8007, lng:  8.2227 },
    zoom: 1,
  });
  fetch('public-transport-ch.geojson').then(function(response) {
    response.json().then(function(result) {
      let locations = result.features.map((val) => {
        var location, weight;
        switch(val.geometry.type){
          case "Point":   //type is point
            location = new google.maps.LatLng( parseFloat(val.geometry.coordinates[1]), parseFloat(val.geometry.coordinates[0]));
            break;
          case "LineString":  //type is LineString
            var x = 0, y= 0;
            val.geometry.coordinates.forEach(coords => {
              x += parseFloat(coords[0]);
              y += parseFloat(coords[1]);
            });
            location = new google.maps.LatLng(y / val.geometry.coordinates.length, x/ val.geometry.coordinates.length );
          break;
          case val.geometry.type == "Polygon":  // type is polygon
              var x = 0, y= 0;
              val.geometry.coordinates[0].forEach(coords => {
                x += parseFloat(coords[0]);
                y += parseFloat(coords[1]);
              });
              location = new google.maps.LatLng(y / val.geometry.coordinates[0].length, x/ val.geometry.coordinates[0].length );
          break;
          case val.geometry.type == "MultiPolygon":  // Type is MultiPolygon
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
            location = new google.maps.LatLng(y/length, x/length);
          break;
          default:
            console.error("Couldn't deserialize following object: ", val)
          break;
        }
        weight = 5;
        return {location: location, weight: weight};
      });
      

      heatmap = new google.maps.visualization.HeatmapLayer({
        data: locations,
        opac: 1,
        
      });


      heatmap.setMap(map);
    });
  });
}