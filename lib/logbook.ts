export interface IDive {
  air_used: number;
  bottom_time: number;
  buddies: string;
  city: string;
  computer: string;
  country: string;
  current_is_calm: boolean;
  current_is_strong: boolean;
  current_is_weak: boolean;
  current: string;
  date: string;
  deco_stops: string;
  depths: number[];
  dive_master: string;
  diveSuit: string;
  diveTime: number;
  emersion_time: number;
  entry_time: string;
  entry: string;
  exit_time: string;
  half_depth_break_time: string | number;
  half_depth_break: string | number;
  lat: string;
  long: string;
  max_depth: number;
  number: number;
  pressure_end: number;
  pressure_start: number;
  repetitive: boolean;
  site: string;
  surfaceInterval: string | number;
  surface_is_calm: boolean;
  surface_is_mid: boolean;
  surface_is_rough: boolean;
  surface: string;
  temps: number[];
  times: number[];
  type: string;
  isAir: boolean;
  visibility_is_enough: boolean;
  visibility_is_good: boolean;
  visibility_is_poor: boolean;
  visibility: string;
  volume_start: number;
  volume_tank: number;
  water: string;
  weather_is_clear: boolean;
  weather_is_cloud: boolean;
  weather_is_rain: boolean;
  weather: string;
  weights: number;
}



export interface IDiveEnriched extends IDive {
  farFinale: string;
  farIniziale: string;
}

export interface ILogbook {
  dives: IDive[];
}

// Empty
interface IEmptyDive {
  empty: boolean;
}
export interface IEmptyLogbook {
  dives: IEmptyDive[];
}

const EMPTY_DIVE: IEmptyDive = {
  empty: true
}

export const EMPTY_LOGBOOK: IEmptyLogbook = {
  dives: [EMPTY_DIVE],
};
