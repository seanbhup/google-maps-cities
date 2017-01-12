// ------------------------GOOGLE------------------------
var mapOptions = {
        	center:{lat: 39.8282, lng: -98.5795},
			zoom: 4,
			// mapTypeId: "hybrid"
			styles: mapStyles
        }
var map = new google.maps.Map(
    document.getElementById("map"),
    mapOptions
);

var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay.setMap(map);



function calcRoute() {
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      	directionsDisplay.setDirections(result);
    }
  });
}

var start = "New York, NY"
var end;
        
var infoWindow = new google.maps.InfoWindow({})
var markers = [];
var poIMarkers = [];
var icon = "http://i.imgur.com/eQ3pSuK.png"

function createMarker(city){
	
	var cityLatLng = {
		lat: city.lat,
		lng: city.lon
	}
	var marker = new google.maps.Marker({
		position: cityLatLng,
		map: map,
		draggable: true,
		title: city.city,
		animation: google.maps.Animation.DROP,
		icon: icon
	});
	google.maps.event.addListener(marker, "click", function(){
		infoWindow.setContent(`<h2> ${city.city}</h2><div> ${city.state}</div><div>${city.yearEstimate}</div>`);
		infoWindow.open(map, marker);	
	});
	markers.push(marker);
}

function createPoI(place){
	// console.log(place);
	var infoWindow = new google.maps.InfoWindow({});
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: icon
	});
	google.maps.event.addListener(marker, "click", () =>{
		infoWindow.setContent(place.name);
		infoWindow.open(map, marker);
	});
	poIMarkers.push(marker);
}


// ------------------------REACT------------------------
var string = "Hello, humans. I come in peace. Tell me information about your civilization. I am ready to Harvest."
var imageUrl = "https://www.base64-image.de/build/img/mr-base64-482fa1f767.png"

class GoogleCity extends React.Component{
	constructor(props){
		super(props);
		this.handleClickedCity = this.handleClickedCity.bind(this);
		this.getDirections = this.getDirections.bind(this);
		this.zoomToCity = this.zoomToCity.bind(this);
	}

	getDirections(){
		end = this.props.cityObject.city;
		calcRoute();
	}

	zoomToCity(event){
		var zoomCityLatLon = new google.maps.LatLng(this.props.cityObject.lat, this.props.cityObject.lon);
		map = new google.maps.Map(
			document.getElementById("map"),
			{
				styles: mapStyles,
				zoom:10,
				center: zoomCityLatLon
			}
		)
		directionsDisplay.setMap(map);
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(
		{
			location: zoomCityLatLon,
			radius: 5000,
			type: ["store"]
		},
		function(results, status){
			// console.log(results);
			if(status === "OK"){
				results.map(function(currentPlace, index){
					createPoI(currentPlace);
				})
			}
		}
	);
		var bounds = new google.maps.LatLng(zoomCityLatLon);
		poIMarkers.map(function(currentMarker, index){
			bounds.extend(currentMarker.getPosition);
		})
		map.fitBounds(bounds);

		// console.log(bounds);

	}

	handleClickedCity(event){
		console.log("Someone clicked on a city");
		google.maps.event.trigger(markers[this.props.cityObject.yearRank - 1], "click")
	}

	render(){

		return(
				<tr>
					<td className="city-rank">{this.props.cityObject.yearRank}</td>
					<td className="city-name" onClick={this.handleClickedCity}>{this.props.cityObject.city}, {this.props.cityObject.state}</td>
					<td className="city-land-area">{this.props.cityObject.landArea}</td>
					<td className="city-population">{this.props.cityObject.yearEstimate}</td>
					<td><button className="get-directions-button" onClick={this.getDirections}>Get Directions</button></td>
					<td><button className="zoom-button" onClick={this.zoomToCity}>Zoom</button></td>
				</tr>
		)
	}
}

class Cities extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			currentCities: this.props.routes[1].cities
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.updateMarkers = this.updateMarkers.bind(this);
		this.setEndingLocation = this.setEndingLocation.bind(this);
		this.setStartingLocation = this.setStartingLocation.bind(this);
	}

	handleInputChange(event){

		var newFilterValue = event.target.value;
		// console.log(newFilterValue);
		var filteredCitiesArray = [];
		// Loop through the list of cities with .map
		this.props.routes[1].cities.map(function(currentCity, index){
			if(currentCity.city.indexOf(newFilterValue) !== -1){
				// hit! I dont care where it is, but its in the word
				filteredCitiesArray.push(currentCity);
			}
		});
		this.setState({
			currentCities: filteredCitiesArray
		})	
	}

	setStartingLocation(event){
		start = event.target.value
	}

	setEndingLocation(event){
		end = event.target.value
	}

	updateMarkers(event){
		event.preventDefault();
		markers.map(function(marker, index){
			marker.setMap(null);
		});
		this.state.currentCities.map(function(city, index){
			createMarker(city)
		})
	}

	render(){
		var cityRows = [];
		this.state.currentCities.map(function(currentCity,index){
			createMarker(currentCity);
			cityRows.push(<GoogleCity cityObject={currentCity} key={index} />)
		})
		return(
			<div>
				<img src={imageUrl} />
				<div className="hello-human">{string}</div>
				<form>
					<input className="get-directions-start" type="text" placeholder="Start Location" onChange={this.setStartingLocation} />
					<input className="get-directions-end" type="text" placeholder="End Location" onChange={this.setEndingLocation} />
					<input className="get-directions-submit button" type="submit" value="Get Directions" onChange={this.setEndingLocation} />
				</form>
				<form onSubmit={this.updateMarkers}>
					<input type="text" placeholder="Enter a city and Update Marker" onBlur={this.handleInputChange} />
					<input className="update-marker button" type="submit" value="Update Markers" />
				</form>
				<table className="table table-bordered table-hover table-responsive">
					<thead>
						<tr>
							<th>Rank</th>
							<th>City, State</th>
							<th>Area</th>
							<th>Population</th>
							<th>Directions</th>
							<th>Zoom</th>
						</tr>
					</thead>
					<tbody>
						{cityRows}
					</tbody>
				</table>
			</div>
		)
	}
}

function Test(props){
	return(
		<h1>This is the Test route</h1>
	)
}

class App extends React.Component{
	constructor(props){
	super(props);
	}

	render(){

		return(
			<div>
				<BootstrapNavBar />
				{this.props.children}
			</div>
		)
	}
}

class BootstrapNavBar extends React.Component{
	constructor(props){
	super(props);
	}

	render(){
		return(
			<nav className="navbar navbar-default">
 				<div className="container-fluid">
  					<div className="navbar-header">
     					<a className="navbar-brand" href="#">Google Maps Router</a>
   					</div>
   					<ul className="nav navbar-nav">
   						<li><ReactRouter.IndexLink to="/" activeClassName="active">Home</ReactRouter.IndexLink></li>
   						<li><ReactRouter.Link to="cities" activeClassName="active">Cities</ReactRouter.Link></li>
  					</ul>
 </div>
</nav>
		)
	}
}
// -----------------------ES5----------------------------
// var Cities = React.createClass({
// 	render: function(){
// 		var cityRows = [];
// 		this.props.cities.map(function(currentCity,index){
// 			// console.log(currentCity.city)
// 			// console.log(cities[index].city)
// 			cityRows.push(<GoogleCity cityObject={currentCity} key={index} />)
// 		})
// 		return(
// 			<div>
// 				{cityRows}
// 				<img src={imageUrl} />
// 				{string}
// 			</div>
// 		)
// 	}
// });
// --------------------------------------------------------
ReactDOM.render(
	<ReactRouter.Router>
		<ReactRouter.Route path="/" component={App}>
			<ReactRouter.IndexRoute component={Cities} cities={cities}>
				<ReactRouter.Route path="/cities" component={Test} />
			</ReactRouter.IndexRoute>
		</ReactRouter.Route>
	</ReactRouter.Router>,
	document.getElementById('cities-container')
)