import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  mapView!: MapView;
  userLocationGraphics: Graphic | any;
  map!: Map;

   // Tetapkan koordinat secara manual
   latitude = 40.6974881; // Ganti dengan latitude yang diinginkan
   longitude = -73.979681; // Ganti dengan longitude yang diinginkan
   
  constructor() { }

  async ngOnInit() {
    this.map = new Map({
      basemap: "topo-vector" // Default basemap
    });

    this.mapView = new MapView({
      container: "container",
      map: this.map,
      zoom: 8
    });

    let weatherServiceFL = new ImageLayer({ url: WeatherServiceUrl });
    this.map.add(weatherServiceFL);

    // Perbarui lokasi pengguna berdasarkan koordinat manual
    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphics.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  // // current location
  //     await this.updateUserLocationOnMap();
  //     this.mapView.center = this.userLocationGraphics.geometry as Point;
  //     setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  //   }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

// update current location
  // async updateUserLocationOnMap() {
  //   let latLng = await this.getLocationService();
  //   let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
  //   if (this.userLocationGraphics) {
  //     this.userLocationGraphics.geometry = geom;
  //   } else {
  //     this.userLocationGraphics = new Graphic({
  //       symbol: new SimpleMarkerSymbol(),
  //       geometry: geom,
  //     });
  //     this.mapView.graphics.add(this.userLocationGraphics);
  //   }
  // }

  // Fungsi untuk memperbarui titik lokasi berdasarkan koordinat manual
  async updateUserLocationOnMap() {
    let geom = new Point({ latitude: this.latitude, longitude: this.longitude });
    
    if (this.userLocationGraphics) {
      this.userLocationGraphics.geometry = geom;
    } else {
      this.userLocationGraphics = new Graphic({
        symbol: new SimpleMarkerSymbol({
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        }),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphics);
    }
  }

  onBasemapChange(event: any) {
    const selectedBasemap = event.detail.value;
    this.map.basemap = selectedBasemap;
  }
}

const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';
