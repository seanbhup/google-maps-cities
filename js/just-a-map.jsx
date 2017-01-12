
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

class Map extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div>
				{this.props.map}
			</div>
		)
	}
}

class Navbar extends React.Component{
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
   						<li><ReactRouter.Link to="directions" activeClassName="active">Directions</ReactRouter.Link></li>
   						<li><ReactRouter.Link to="locate" activeClassName="active">Locate</ReactRouter.Link></li>
  					</ul>
 				</div>
			</nav>
		)
	}
}

class Directions extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="get-directions-wrapper">
				<input className="input start-input" type="text" placeholder="Start" />
				<input className="input end-input" type="text" placeholder="End" />
				<input className="input get-directions-button" type="submit" value="Get Directions" />
			</div>
		)
	}
}

class Locate extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="locate-wrapper">
				<input className="input input-locate" type="text" placeholder="Name a Location" />
				<input className="input input-locate-button" type="submit" value="Locate" />
			</div>
		)
	}
}

class App extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div>
				<div>
					<Navbar />
				</div>
				<div>
					{this.props.children}
				</div>
			</div>
		)
	}
}

ReactDOM.render(
	<ReactRouter.Router>
		<ReactRouter.Route path="/" component={App}>
			<ReactRouter.IndexRoute component={Map} map={map} />
				<ReactRouter.Route path="/directions" component={Directions} />
				<ReactRouter.Route path="/locate" component={Locate} />
		</ReactRouter.Route>
		
	</ReactRouter.Router>,
	document.getElementById("cities-container")
)

