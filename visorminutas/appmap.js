var map;

$(document).ready(function(){
  $('input[type="checkbox"]').click(function(){
    if($(this).prop("checked") == true){
      // alert("Checkbox is checked.");
      map.on('click', onMapClick);
    }
    else if($(this).prop("checked") == false){
      // alert("Checkbox is unchecked.");
      map.off('click');
    }
  });
});

$("#ayuda").click(function() {
  $("#ayudaModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#basemapslider").slider({
  animate: true,
  value: 1,
  orientation: "vertical",
  height: 25,
  min: 0,
  max: 1,
  step: 0.1,
  slide: function (event, ui) {
    minutas.setOpacity(ui.value);
  }
});

$('#basemapslider').mousedown(function(){
  map.dragging.disable();
})

$('#basemapslider').mouseup(function(){
  map.dragging.enable();
})

$("#embebed-btn").click(function() {
  $("#embebedModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
  
});

$('#urliframe').html("<iframe width='425' height='350' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='"+document.URL+"' style='border: 1px solid black'></iframe><br/><small><a href='"+document.URL+"'>Ver mapa más grande</a></small>");

var map = L.map('map',{
  attributionControl: false
}).setView([37.885, -4.777], 5);

map.options.maxZoom = 18;

var attributionIGN = 'PNOA, Minutas y Unidades Administrativas cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>';
var credits = L.control.attribution().addTo(map);
credits.addAttribution(attributionIGN)

var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18
  //attribution: 'Map data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


var Spain_Catastro = L.tileLayer.wms("https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?", {
    layers: 'Catastro',
    format: 'image/png',
    transparent: true,
    attribution: '<a href="https://www.sedecatastro.gob.es/"" target="_blank">Dirección General de Catastro</a>'
});


var Spain_PNOA_Ortoimagen = L.tileLayer.wms('http://www.ign.es/wms-inspire/pnoa-ma', {
  layers: 'OI.OrthoimageCoverage',
  format: 'image/png',
  transparent: true,
  continuousWorld : true
});

map.addLayer(Spain_PNOA_Ortoimagen);

var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  attribution: '<a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors, ©CartoDB',
  maxZoom: 10,
}).addTo(map);

map.addLayer(positron);



var minutas = L.tileLayer.wms("http://www.ign.es/wms/minutas-cartograficas?", {
  layers: 'Minutas',
  format: 'image/png',
  transparent: true
});

minutas.addTo(map);

var primeraedmtn = L.tileLayer.wms('http://www.ign.es/wms/primera-edicion-mtn', {
  layers: 'MTN50',
  format: 'image/png',
  transparent: true,
  continuousWorld : true,
});

var UnidadesAdministrativas = L.tileLayer.wms('http://www.ign.es/wms-inspire/unidades-administrativas', {
  layers: 'AU.AdministrativeBoundary',
  format: 'image/png',
  transparent: true,
  continuousWorld : true,
});

L.control.layers({

  "PNOA Máx. Actualidad": Spain_PNOA_Ortoimagen,
  "Catastro": Spain_Catastro,
  'Primera edición MTN': primeraedmtn,
  'OpenStreetMap':osm
},{
  'Minutas Cartográficas':minutas,
  'Unidades Administrativas': UnidadesAdministrativas

},{position:'topright'}).addTo(map);



//  Buscador 
L.Control.geocoder({
  collapsed:true,
  position:'topleft',
  showResultIcons: false,
  placeholder: 'Buscar...'
}).addTo(map);

var measureControl = L.control.measure({
  position: 'topleft',
  primaryLengthUnit: 'meters', 
  secondaryLengthUnit: undefined,
  primaryAreaUnit: 'sqmeters', 
  secondaryAreaUnit: undefined
}
);
measureControl.addTo(map);

// Cargador

// var style = {color:'red', opacity: 1.0, fillOpacity: 1.0, weight: 2, clickable: false};
// L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';
// L.Control.fileLayerLoad({
//   fitBounds: true
//             // layerOptions: {style: style,
//             //                pointToLayer: function (data, latlng) {
//             //                   return L.circleMarker(latlng, {style: style});
//             //                }},
//          }).addTo(map);

// hash
var hash = new L.Hash(map);

// L.Control.measureControl().addTo(map);


// map.addEventListener('click',onMapClick);


var popup = L.popup({
  maxWidth:400
  
});

function onMapClick(e) {
  var latlngStr = '('+ e.latlng.lat.toFixed(3) + ", " + e.latlng.lng.toFixed(3)+')';
  var BBOX = map.getBounds()._southWest.lng + ", " + map.getBounds()._southWest.lat + ", " + map.getBounds()._northEast.lng + ", " + map.getBounds()._northEast.lat;
  var WIDTH = map.getSize().x;
  var HEIGHT = map.getSize().y;   
  var X = map.layerPointToContainerPoint(e.layerPoint).x.toFixed(0);
  var Y = map.layerPointToContainerPoint(e.layerPoint).y.toFixed(0);
  URL = 'http://www.ign.es/wms/minutas-cartograficas?request=GetFeatureInfo&service=WMS&version=1.1.1&info_format=HTML&exceptions=application/vnd.ogc.se_xml&layers=minutas&styles=&srs=EPSG%3A4326&format=image%2Fpng&bbox='+ BBOX + '&width='+ WIDTH +'&height='+ HEIGHT + '&query_layers=minutas&feature_count=20&x='+ X +'&y='+ Y;

  popup.setContent("iframe src='"+URL+"' width='300' height='100' frameborder='0'></iframe>")

  popup
  .setLatLng(e.latlng)
        // .setContent("You clicked the map at " + e.latlng.toString())
        .setContent("<h3><br>Datos minutas</br></h3><iframe src='"+URL+"' width='300' height='200' frameborder='0'></iframe>")
        .openOn(map);

      }