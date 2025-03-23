let map = L.map('map').setView([20.5937,78.9629], 9);

if(listing != "undefined"){
    let coordinates = listing.geometry.coordinates;
    let leafletCoordinates = [coordinates[1],coordinates[0]];
    map.setView(leafletCoordinates,9);
   let marker =  L.marker(leafletCoordinates).addTo(map);
   marker.bindPopup(`<b>${listing.title}</b><br>${listing.location},${listing.country}`);
   marker.on("click",()=>{
        this.openPopup();
   })
   console.log(marker);
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

