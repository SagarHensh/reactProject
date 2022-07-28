import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { consoleLog } from '../../../../services/commonFunction/commonFunction';

class GoogleMapsReact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            listData: [],
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            // consoleLog("ListData ::", this.props.value);
            if (this.props.value.length > 0) {
                this.setState({
                    listData: this.props.value
                })
            } else {
                this.setState({
                    listData: []
                })
            }
        }
    }

    onMarkerClick = (props, marker, e) => {
        // console.log("Props", props);
        // console.log("marker:", marker)
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };

    // showMarkerPoint = () =>{

    // }
    render() {
        var bounds = new this.props.google.maps.LatLngBounds();
        for (var i = 0; i < this.state.listData.length; i++) {
            bounds.extend({
                lat: Number(this.state.listData[i].lat),
                lng: Number(this.state.listData[i].longitude)
            });
        }
        return (
            // <Maps2 />
            <Map google={this.props.google} zoom={14}
                streetViewControl={false}
                fullscreenControl={false}
                mapTypeControl={false}
                initialCenter={{
                    lat: 22.5835026,
                    lng: 88.4105829
                }}
                onDragend={this.centerMoved}
                bounds={bounds}
            >

                {/* <Marker
                    title={'The marker`s title will appear as a tooltip.'}
                    name={'SOMA'}
                    position={{ lat: 22.4988, lng: 88.3714 }} /> */}
                {/* <Marker
              name={'Dolores park'}
              position={{ lat: 22.5751, lng: 88.3629 }} />
            <Marker /> */}
                {this.state.listData.length > 0 ?
                    this.state.listData.map((data, i) =>
                        <Marker
                            carrierId={data.carrier}
                            name={data.carrierName}
                            type={data.carrierType}
                            phone={data.phone}
                            onClick={this.onMarkerClick}
                            // position={{ lat: 22.5751, lng: 88.3629 }}
                            position={{ lat: data.lat, lng: data.longitude }}
                            icon={{
                                url: "assets/images/map-loc-icon.png",
                                anchor: new window.google.maps.Point(32, 32),
                                scaledSize: new window.google.maps.Size(45, 60)
                            }}
                            draggable={false}
                            key={i}
                        />) : <React.Fragment></React.Fragment>}
                {/* <Marker
                    name={'Howrah station'}
                    onClick={this.onMarkerClick}
                    position={{ lat: 22.5839, lng: 88.3434 }}
                    icon={{
                        url: "assets/images/map-loc-icon.png",
                        anchor: new window.google.maps.Point(32, 32),
                        scaledSize: new window.google.maps.Size(45, 60)
                    }}
                    draggable={false}
                />
                <Marker
                    name={'Millenium park'}
                    onClick={this.onMarkerClick}
                    position={{ lat: 22.5728, lng: 88.3445 }}
                    icon={{
                        url: "assets/images/map-loc-icon.png",
                        anchor: new window.google.maps.Point(32, 32),
                        scaledSize: new window.google.maps.Size(45, 60)
                    }}
                    draggable={false}
                />
                <Marker
                    name={'Sovabazar Rajbari'}
                    onClick={this.onMarkerClick}
                    position={{ lat: 22.5961, lng: 88.3671 }}
                    icon={{
                        url: "assets/images/map-loc-icon.png",
                        anchor: new window.google.maps.Point(32, 32),
                        scaledSize: new window.google.maps.Size(45, 60)
                    }}
                    draggable={false}
                />
                <Marker
                    name={'Sealdah station'}
                    onClick={this.onMarkerClick}
                    position={{ lat: 22.5678, lng: 88.3710 }}
                    icon={{
                        url: "assets/images/map-loc-icon.png",
                        anchor: new window.google.maps.Point(32, 32),
                        scaledSize: new window.google.maps.Size(45, 60)
                    }}
                    draggable={false}
                /> */}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div className='map-toggle'>
                        {/* <h1>{this.state.selectedPlace.name}</h1> */}
                        <ul>
                            <li>Carrier # <strong>{this.state.selectedPlace.carrierId}</strong></li>
                            <li>Name <strong>{this.state.selectedPlace.name}</strong></li>
                            <li>Type <strong>{this.state.selectedPlace.type}</strong></li>
                            <li>Mobile <strong>+1 {this.state.selectedPlace.phone}</strong></li>
                        </ul>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyBUYhk7JKoA5WTtvGiRCzbqAB6Q_jvc1fA")
})(GoogleMapsReact);