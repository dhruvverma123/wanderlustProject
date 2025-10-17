maptilersdk.config.apiKey = mapKey;

const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates, // [longitude, latitude]
  zoom: 9, // initial zoom level
});

const marker = new maptilersdk.Marker()
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup().setHTML(
      `<h4>${listing.location}</h4><p>Exact location will be provided after booking<p>`
    )
  )
  .addTo(map);
