var mapOptions = 
		{
	        center:{lat: 39.8282, lng: -98.5795},
			zoom: 4,
			// mapTypeId: "hybrid"
			styles: mapStyles
    	}
var map = new google.maps.Map(
	document.getElementById("map"),
    mapOptions
    );