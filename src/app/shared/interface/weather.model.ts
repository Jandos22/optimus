export interface WeatherItem {
  clouds?: {
    all?: number;
  };
  cod?: number;
  coord?: {
    lon?: number;
    lat?: number;
  };
  dt?: number;
  id?: number;
  main?: {
    grnd_level?: number;
    humidity?: number;
    pressure?: number;
    sea_level?: number;
    temp?: number;
    temp_max?: number;
    temp_min?: number;
  };
  name?: string;
  night?: boolean;
  sys?: {
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
  weather?: WeatherOWM[];
  wind?: {
    deg?: number;
    speed?: number;
  };
}

export interface WeatherOWM {
  id?: number;
  icon?: string;
  description?: string;
  main?: string;
}
