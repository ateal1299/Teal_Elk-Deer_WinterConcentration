
var map = L.map('map').setView([39.65, -106.9], 8);

// Basemaps
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri'
});

// Elk habitat
var elkLayer = L.geoJSON(null, {
    style: {color: 'green', weight: 2, fillOpacity: 0.25},
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<b>Elk Winter Concentration Area</b>');
    }
}).addTo(map);

// Mule deer habitat
var deerLayer = L.geoJSON(null, {
    style: {color: 'orange', weight: 2, fillOpacity: 0.25},
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<b>Mule Deer Winter Concentration Area</b>');
    }
}).addTo(map);

// Overlapping habitat
var overlapLayer = L.geoJSON(null, {
    style: {color: 'purple', weight: 1, fillColor: 'purple', fillOpacity: 0.5},
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<b>Shared Winter Habitat</b>');
    }
}).addTo(map);

// Purple markers showing overlap area
var overlapMarkers = L.layerGroup().addTo(map);

// Layer controls
L.control.layers(
    {'Streets': streets, 'Satellite': satellite},
    {
        'Elk Winter Habitat': elkLayer,
        'Mule Deer Winter Habitat': deerLayer,
        'Overlapping Habitat': overlapLayer,
        'Overlap Area Markers': overlapMarkers
    }
).addTo(map);

// GIS data URLs
var box = '-108.55,39.20,-105.40,40.20';

function gisUrl(number) {
    return 'https://gisdnr.state.co.us/arcgis/rest/services/ECMC_Public/High_Priority_Habitat_2026/MapServer/' +
        number + '/query?f=geojson&where=1%3D1' +
        '&geometry=' + box + '&geometryType=esriGeometryEnvelope' +
        '&inSR=4326&outSR=4326&spatialRel=esriSpatialRelIntersects' +
        '&outFields=*&returnGeometry=true';
}

// Load both datasets
$.when($.getJSON(gisUrl(29)), $.getJSON(gisUrl(37)))
.done(function(elkResponse, deerResponse) {

    var elkData = elkResponse[0];
    var deerData = deerResponse[0];

    elkLayer.addData(elkData);
    deerLayer.addData(deerData);

    document.getElementById('status').textContent =
        'Elk and mule deer winter concentration areas loaded.';

    var overlapArea = 0;
    var overlapCount = 0;

    // Calculate shared habitat
    elkData.features.forEach(function(elk) {
        deerData.features.forEach(function(deer) {

            try {
                var overlap = turf.intersect(elk, deer);

                if (overlap) {
                    var area = turf.area(overlap) / 1000000;

                    overlapArea += area;
                    overlapCount++;

                    overlapLayer.addData(overlap);

                    // Find a point inside the overlap polygon
                    var point = turf.pointOnFeature(overlap);
                    var coords = point.geometry.coordinates;

                    // Add a purple marker with the area
                    L.circleMarker([coords[1], coords[0]], {
                        radius: 5,
                        color: 'purple',
                        fillColor: 'purple',
                        fillOpacity: 0.9
                    }).bindPopup(
                        '<b>Shared Winter Habitat</b><br>' +
                        'Species: Elk and Mule Deer<br>' +
                        'Overlap Area: ' + area.toFixed(2) + ' km²'
                    ).addTo(overlapMarkers);
                }

            } catch (error) {
                console.log('Polygon comparison failed:', error);
            }

        });
    });

    document.getElementById('results').textContent =
        'Estimated overlapping habitat: ' +
        overlapArea.toFixed(2) + ' km² across ' +
        overlapCount + ' polygon intersections.';

}).fail(function() {
    document.getElementById('status').textContent =
        'One or both GIS datasets failed to load.';
});

// Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');

    div.innerHTML =
        '<b>Winter Concentration Areas</b><br>' +
        '<i style="background: green"></i> Elk<br>' +
        '<i style="background: orange"></i> Mule Deer<br>' +
        '<i style="background: purple"></i> Overlapping Habitat<br>' +
        '<span style="color: purple">&#9679;</span> Overlap Area Marker';

    return div;
};

legend.addTo(map);
