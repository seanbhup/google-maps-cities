// ------------------------GOOGLE------------------------
var map = new google.maps.Map(
	document.getElementById("map"),
	{
		center:{lat: 39.8282, lng: -98.5795},
		zoom: 4,
		mapTypeId: "hybrid"
	}
)

var infoWindow = new google.maps.InfoWindow({})
var markers = [];

function createMarker(city){
	var icon = "http://i.imgur.com/eQ3pSuK.png"
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


// ------------------------REACT------------------------
var string = "Hello, humans. I come in peace. Tell me information about your civilization."
var imageUrl = "https://www.base64-image.de/build/img/mr-base64-482fa1f767.png"

class GoogleCity extends React.Component{
	constructor(props){
		super(props);
		this.handleClickedCity = this.handleClickedCity.bind(this)
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
				</tr>
		)
	}
}

class Cities extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			currentCities: this.props.cities
		};
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event){

		var newFilterValue = event.target.value;
		// console.log(newFilterValue);
		var filteredCitiesArray = [];
		// Loop through the list of cities with .map
		this.props.cities.map(function(currentCity, index){
			if(currentCity.city.indexOf(newFilterValue) !== -1){
				// hit! I dont care where it is, but its in the word
				filteredCitiesArray.push(currentCity);
			}
		});
		this.setState({
			currentCities: filteredCitiesArray
		})	
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
				{string}
				<form onSubmit={this.updateMarkers}>
					<input type="text" onChange={this.handleInputChange} />
					<input className="update-marker" type="submit" value="Update Markers" />
				</form>
				<table className="table table-bordered table-striped">
					<thead>
						<tr>
							<th>Rank</th>
							<th>City, State</th>
							<th>Area</th>
							<th>Population</th>
							
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
	<Cities cities={cities} />,
	document.getElementById('cities-container')
)