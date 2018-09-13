import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

import * as _ from 'lodash';

// rxjs
import { take } from 'rxjs/operators';

// date-fns
import * as differenceInHours from 'date-fns/difference_in_hours';
import * as parse from 'date-fns/parse';

// services
import { WeatherService } from '../services';

// interfaces
import { LocationEnt } from '../../../shared/interface/locations.model';
import { WeatherItem } from '../../../shared/interface/weather.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-location',
  styleUrls: ['location.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="location-inner-container" fxLayout="row wrap">

        <!-- location name and current weather -->
        <div class="top-row" fxLayout="row nowrap">
          <div class="location-name">
              {{ ($location | async)?.Name }}
          </div>
          <app-weather-line
            [hidden]="!($showWeather | async)"
            class="weather-line"
            fxLayout="row nowrap"
            fxLayoutAlign="end start"
            [weatherCurrent]="($weatherCurrent | async)"
            [units]="($location | async)?.WeatherUnits">
          </app-weather-line>
        </div>

        <div class="bottom-row" fxLayout="row nowrap" FxLayoutAlign="center center">

          <app-location-dashboard
            class="app-location-dashboard"
            fxLayout="row wrap" fxLayoutAlign="start start"
            [myLocation]="$location | async">
          </app-location-dashboard>

        </div>
    </div>
    `
})
export class LocationComponent implements OnInit, OnChanges {
  @Input()
  id: number;

  // subjects
  $location = new Subject<LocationEnt>();
  $weatherCurrent = new Subject<WeatherItem>();
  $showWeather = new Subject<boolean>();

  // location: LocationEnt;
  // weatherCurrent: WeatherItem;
  // weatherCurrentTime: Date;

  constructor(private weather: WeatherService, private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.id && changes.id.currentValue) {
      this.getCurrentLocation(changes.id.currentValue);
    }
  }

  getCurrentLocation(locationId: number) {
    const $get = this.weather
      .getLocationById(locationId)
      .pipe(
        take(1) // for self destroy
      )
      .subscribe(
        success => this.getCurrentLocationSuccess(success),
        error => console.log(error),
        () => console.log('completed getting current location')
      );
  }

  getCurrentLocationSuccess(location: LocationEnt[]) {
    // console.log('getCurrentLocationSuccess');
    // console.log(location[0]);

    // check if location wants to show weather
    this.$showWeather.next(location[0].ShowWeather);

    // pass new location value
    this.$location.next(location[0]);

    // if location wants to show weather then run workflow
    if (location[0].ShowWeather) {
      this.onShowWeather(location[0]);
    }
  }

  onShowWeather(location: LocationEnt) {
    // check how old is weather info in location item
    const now = Date.now();
    const prev = location.WeatherCurrentTime;
    const howOld = differenceInHours(now, prev);
    // console.log(howOld);

    // if difference is less 1 hour
    // then use weather from location item
    if (howOld <= 1) {
      // console.log('less than 1 hour');
      const weather = JSON.parse(location.WeatherCurrent);
      this.passNewWeather(weather);
    } else if (howOld >= 1) {
      this.fetchCurrentWeather(
        location.Latitude,
        location.Longitude,
        location.OwmApiKey
      );
    }
  }

  fetchCurrentWeather(lat: string, lon: string, key: string) {
    const $weather = this.weather
      .fetchCurrentWeather(lat, lon, key)
      .pipe(take(1))
      .subscribe(
        success => this.fetchCurrentWeatherSuccess(success),
        error => console.log(error),
        () => console.log('completed fetching current weather')
      );
  }

  fetchCurrentWeatherSuccess(weather: WeatherItem) {
    // console.log('successfully got new weather data via API');
    // console.log(weather);

    this.passNewWeather(weather);
    this.updateCurrentWeather(weather);
  }

  updateCurrentWeather(weather: WeatherItem) {
    const $update = this.weather.updateCurrentWeather({
      Id: this.id,
      WeatherCurrent: JSON.stringify(weather),
      WeatherCurrentTime: parse(Date.now())
    });

    $update
      .pipe(take(1))
      .subscribe(
        success => this.updateCurrentWeatherSuccess(success),
        error => console.log(error),
        () => console.log('completed updating weather')
      );
  }

  updateCurrentWeatherSuccess(location: LocationEnt[]) {
    console.log(location);
  }

  passNewWeather(weather: WeatherItem) {
    // console.log(weather);
    const isNight = this.isNight(
      weather.dt,
      weather.sys.sunrise,
      weather.sys.sunset
    );
    // pass weather data to via subject
    this.$weatherCurrent.next({ ...weather, night: isNight });
  }

  isNight(dt: number, sunrise: number, sunset: number) {
    const gt_sunset = sunset - dt <= 0 ? true : false;
    const gt_sunrise = sunrise - dt <= 0 ? true : false;
    return (gt_sunrise && gt_sunset) || (!gt_sunrise && !gt_sunset);
  }
}
