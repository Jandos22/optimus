import {
  retry,
  take,
  map,
  tap,
  catchError,
  switchMap,
  concatMap
} from 'rxjs/operators';
import { from, of, Observable } from 'rxjs';
import { ApiPath, PathOptimus } from './../../../shared/constants/index';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocationEnt } from '../../../shared/interface/locations.model';
import { WeatherItem } from '../../../shared/interface/weather.model';
import { SharepointService } from '../../../shared/services/sharepoint.service';

// we use OpenWeatherMap API (https://openweathermap.org/) to get weather data
// free plan is used, that is why we are limited in number of API calls per given API KEY
// ZOmbayev (developer) created 1 account in OpenWeatherMap
// and registered 2 API KEYS for KZTZ and KZAS locations
// NgLocations list has OwmApiKey field which holds own API_KEY for given location

@Injectable()
export class WeatherService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  // 1. Check if NgLocations already has fresh current weather
  //    by comparing WeatherCurrentTime field and Current Time
  //    if difference is less than 1 hour,
  //    - then don't make API call, but use data in WeatherCurrent field
  //    if difference is more than 1 hour,
  //    - then make new API call, and refresh data in WeatherCurrent field

  // api.openweathermap.org/data/2.5/weather?lat=35&lon=139

  getLocationById(ID: number) {
    const url = `${ApiPath}/web/lists/getByTitle('NgLocations')/items(${ID})`;
    const get$ = from(sprLib.rest({ url, type: 'GET' }));
    return get$.pipe(
      retry(3),
      // tap(data => console.log(data)),
      map(location => location as LocationEnt[])
      //   catchError(error => of(this.getLocationByIdError(error)))
    );
  }

  getLocationByIdError(error) {
    console.log(error);
  }

  fetchCurrentWeather(
    lat: string,
    lon: string,
    key: string
  ): Observable<Object> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${key}`;
    return this.http.get(url);
  }

  updateCurrentWeather(newWeather: LocationEnt) {
    const fdv$ = this.sp.getFDV();
    return fdv$.pipe(
      take(1),
      concatMap(fdv => {
        console.log(fdv);
        const update$ = new sprLib.list({ name: 'NgLocations', ...fdv }).update(
          newWeather
        );
        return from(update$);
      })
    );
  }

  getWeatherIcon(weather: WeatherItem) {
    if (weather) {
      const state = weather.weather[0].main;
      const night = weather.night;
      if (state === 'Clear' && night) {
        return PathOptimus + '/assets/weather/night-clear.svg';
      }
      if (state === 'Clear' && !night) {
        return PathOptimus + '/assets/weather/day-clear.svg';
      }
      if (state === 'Clouds' && night) {
        return PathOptimus + '/assets/weather/night-clouds.svg';
      }
      if (state === 'Clouds' && !night) {
        return PathOptimus + '/assets/weather/day-clouds.svg';
      }
      if (state === 'Snow' && night) {
        return PathOptimus + '/assets/weather/night-snow.svg';
      }
      if (state === 'Snow' && !night) {
        return PathOptimus + '/assets/weather/day-snow.svg';
      }
      if ((state === 'Rain' || state === 'Drizzle') && night) {
        return PathOptimus + '/assets/weather/night-rain.svg';
      }
      if ((state === 'Rain' || state === 'Drizzle') && !night) {
        return PathOptimus + '/assets/weather/day-rain.svg';
      }
      if (state === 'Thunderstorm' || state === 'Storm') {
        return PathOptimus + '/assets/weather/storm.svg';
      }
      if (state === 'Mist' || state === 'Fog') {
        return PathOptimus + '/assets/weather/fog.svg';
      }
    } else {
      return null;
    }
  }
}
