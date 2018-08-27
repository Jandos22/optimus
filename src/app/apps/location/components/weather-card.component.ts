import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

import * as _ from 'lodash';

// interfaces
import { WeatherItem } from '../../../shared/interface/weather.model';
import { PathOptimus } from '../../../shared/constants';

@Component({
  selector: 'app-weather-card',
  styleUrls: ['weather-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="weather-day">
      {{ day }}
    </div>
    <div class="weather-icon" fxLayout="row nowrap" fxLayoutAlign="center center">
      <img [src]="getWeatherIcon()" class="icon" *ngIf="weatherCurrent">
    </div>
    <div class="weather-temp">
      {{ temp }}{{ isMetric ? '&#8451;' : isImperial ? '&#8457;' : ''}}
    </div>
    <div class="weather-state">
      {{ state }}
    </div>
    `
})
export class WeatherCardComponent {
  @Input()
  weatherCurrent: WeatherItem;

  @Input()
  units: string;

  @Input()
  day: string;

  constructor() {}

  get isMetric() {
    return this.units === 'Metric' ? true : false;
  }

  get isImperial() {
    return this.units === 'Imperial' ? true : false;
  }

  get temp() {
    if (this.weatherCurrent) {
      const orig = this.weatherCurrent.main.temp;
      const temp = this.isMetric ? this.kel2cel(orig) : this.kel2far(orig);
      console.log(temp);
      return temp;
    } else {
      return null;
    }
  }

  get state() {
    if (this.weatherCurrent) {
      const orig = this.weatherCurrent.weather[0].main;
      return orig.toUpperCase();
    } else {
      return null;
    }
  }

  getWeatherIcon() {
    if (this.weatherCurrent) {
      const state = this.weatherCurrent.weather[0].main;
      const night = this.weatherCurrent.night;
      if (state === 'Clear' && night) {
        return PathOptimus + '/assets/weather/night-clear.svg';
      }
    } else {
      return null;
    }
  }

  kel2cel(kel: any) {
    return _.round(kel - 273.15);
  }

  kel2far(kel: any) {
    return _.round(kel * (9 / 5) - 459.67);
  }
}
