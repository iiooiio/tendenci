var profile_redirect = '/profiles'
var disaster_redirect = '/social-services/responders'
var responder_redirect = '/social-services/relief-areas'

var map;

var fromProjection = new OpenLayers.Projection("EPSG:4326");    // Transform from WGS 1984
var toProjection   = new OpenLayers.Projection("EPSG:900913");  // to Spherical Mercator Projection

var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
layer_style.fillOpacity = 1;
layer_style.fill = true;
layer_style.stroke = false;

var style_blue = OpenLayers.Util.extend({}, layer_style);
style_blue.fillColor = "blue";

var style_red = OpenLayers.Util.extend({}, layer_style);
style_red.fillColor = "red";

var style_star = OpenLayers.Util.extend({}, style_blue);
style_star.graphicName = "star";
style_star.pointRadius = 10;

function initialize_map() {
    if (map == undefined) {
        map = new OpenLayers.Map('map');
        map.addLayer(new OpenLayers.Layer.OSM());
    }
}

function plotpoints(responder_points, disaster_points, center){

    initialize_map();
    var vectorLayer = new OpenLayers.Layer.Vector("Vector Layer", {style: layer_style});
    vectorLayer.events.register("featureselected", vectorLayer, selected);
    var featurePoints = new Array()
    for (i=0; i<responder_points.length; i++) {
        entry = responder_points[i];
        // create a point feature
        var point = new OpenLayers.Geometry.Point(entry[0], entry[1]).transform(fromProjection, toProjection);
        var pointFeature = new OpenLayers.Feature.Vector(point,null,style_blue);
        featurePoints.push(pointFeature);
    }
    for (i=0; i<disaster_points.length; i++) {
        entry = disaster_points[i];
        // create a point feature
        var point = new OpenLayers.Geometry.Point(entry[0], entry[1]).transform(fromProjection, toProjection);
        var pointFeature = new OpenLayers.Feature.Vector(point,null,style_red);
        featurePoints.push(pointFeature);
    }
    if (Array.isArray(center)) {
        var point = new OpenLayers.Geometry.Point(center[0], center[1]).transform(fromProjection, toProjection);
        var pointFeature = new OpenLayers.Feature.Vector(point,null,style_star);
        featurePoints.push(pointFeature);
    }
    if (typeof(point) !== "undefined") {
        map.setCenter(new OpenLayers.LonLat(point.x, point.y), 4);
    } else {
        map.setCenter(new OpenLayers.LonLat(0, 0), 2);
    }
    map.addLayer(vectorLayer);

    var control = new OpenLayers.Control.SelectFeature(vectorLayer);
    map.addControl(control);
    control.activate();

    vectorLayer.addFeatures(featurePoints);
}

function selected (evt) {
    var point = evt.feature.geometry.bounds.getCenterLonLat().transform(toProjection, fromProjection);
    if (evt.feature.style == style_blue) {
        var url = responder_redirect + '?lon=' + point.lon + '&lat=' + point.lat + '&d=20'
        window.location = url
    }else if (evt.feature.style == style_red) {
        var url = disaster_redirect + '?lon=' + point.lon + '&lat=' + point.lat + '&d=20'
        window.location = url
    }else if (evt.feature.style == style_star) {
        window.location = profile_redirect
    }
}
