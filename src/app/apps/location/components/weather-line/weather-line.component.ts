import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import * as _ from 'lodash';

// services
import { WeatherService } from '../../services';

// interfaces
import { WeatherItem } from '../../../../shared/interface/weather.model';
import { PathOptimus } from '../../../../shared/constants';

@Component({
  selector: 'app-weather-line',
  styleUrls: ['weather-line.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="weather-line-icon" fxLayout="row nowrap" fxLayoutAlign="center center">
      <img [src]="weather.getWeatherIcon(weatherCurrent)" class="icon" *ngIf="weatherCurrent">
    </div>

    <div class="weather-line-main" fxLayout="column" fxLayoutAlign="center center">
      <div class="weather-line-temp">
        {{ temp }}{{ isMetric ? '&#8451;' : isImperial ? '&#8457;' : ''}}
      </div>
      <div class="weather-line-state">
        {{ state }}
      </div>
    </div>

    <div class="weather-line-wind" fxLayout="column" fxLayoutAlign="center center">
      <div class="wind-speed" [matTooltip]="wind + ' m/s'">
        {{ wind }}
      </div>
      <div class="weather-line-state">WIND</div>
    </div>
    `
})
export class WeatherLineComponent {
  @Input()
  weatherCurrent: WeatherItem;

  @Input()
  units: string;

  @Input()
  day: string;

  constructor(private weather: WeatherService) {}

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.weatherCurrent && changes.weatherCurrent.currentValue) {
  //     console.log(changes.weatherCurrent.currentValue);
  //   }
  // }

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
      // console.log(temp);
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

  get wind() {
    if (this.weatherCurrent) {
      return this.weatherCurrent.wind.speed;
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
