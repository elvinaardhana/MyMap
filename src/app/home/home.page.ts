import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point'; // Import Point geometry
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  latitude!: number;
  longitude!: number;

  constructor() { }

  public async ngOnInit() {
    // Get the user's current position
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    // Create the map
    const map = new Map({
      basemap: 'topo-vector'
    });

    // Create the map view
    const view = new MapView({
      container: 'container',  // Reference to the DOM element
      map: map,
      zoom: 12,
      center: [this.longitude, this.latitude]
    });

    // Create a Point geometry for the user's location
    const point = new Point({
      longitude: this.longitude,
      latitude: this.latitude
    });

    // Create a marker symbol
    const markerSymbol = {
      type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
      color: 'blue',         // Marker color
      outline: {
        color: 'white',
        width: 1
      }
    };

    // Create a graphic for the point and symbol
    const pointGraphic = new Graphic({
      geometry: point,  // Pass the Point object here
      symbol: markerSymbol
    });

    // Wait for the view to load, then add the marker
    view.when(() => {
      view.graphics.add(pointGraphic); // Add the marker to the view
    });
  }
}
