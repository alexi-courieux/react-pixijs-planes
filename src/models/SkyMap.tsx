import Plane from "./Plane.tsx";
import { v4 as uuidv4 } from 'uuid';
import Airport from "./Airport.tsx";

export default interface SkyMap {
  width: number;
  height: number;
  airports: Airport[];
  planes: Plane[];
}

const generateRandomPlane = (airports: Airport[]): Plane => {
  const departure = airports[Math.floor(Math.random() * airports.length)];
  const destinations = airports.filter(a => a !== departure);
  const arrival = destinations[Math.floor(Math.random() * destinations.length)];

  const distance = Math.sqrt(Math.pow(departure.pos.lon - arrival.pos.lon, 2) + Math.pow(departure.pos.lat - arrival.pos.lat, 2));
  const targetAltitude = Math.min(Math.max(1000, distance * 10 + Math.random() * 1000), 30000);
  const targetSpeed = Math.min(Math.max(900, distance * 10 + Math.random() * 100), 500);
  const initialRotation = Math.atan2(arrival.pos.lat - departure.pos.lat, arrival.pos.lon - departure.pos.lon);

  return {
    id: uuidv4().substring(0, 8),
    pos: {
      lon: departure.pos.lon,
      lat: departure.pos.lat,
      alt: departure.pos.alt,
    },
    rot: initialRotation,
    spd: 500,
    dep: departure,
    arr: arrival,
    targetAlt: targetAltitude,
    targetSpd: targetSpeed
  };
};

export const normalizeCoordinates = (coordinateRange:{minLat: number, maxLat: number, minLon: number, maxLon: number}, mapInfo:{width: number, height: number}, pos: {lon: number, lat: number}): { x: number, y: number } => {
  const { minLat, maxLat, minLon, maxLon } = coordinateRange;
  const { width, height } = mapInfo
  const { lon, lat } = pos;

  const x = ((lon - minLon) / (maxLon - minLon)) * width;
  const y = height - ((lat - minLat) / (maxLat - minLat)) * height; // Invert y-coordinate

  return { x, y };
}

export const generateRandomSkyMap = (width: number, height:number): SkyMap => {
  const airportsData: Airport[] = [
    { code: 'LHR', pos: { lon: -0.4543, lat: 51.4700, alt: 25 }, name: 'London Heathrow Airport' },
    { code: 'CDG', pos: { lon: 2.55, lat: 49.0097, alt: 119 }, name: 'Charles de Gaulle Airport' },
    { code: 'FRA', pos: { lon: 8.5705, lat: 50.0333, alt: 111 }, name: 'Frankfurt Airport' },
    { code: 'AMS', pos: { lon: 4.7639, lat: 52.3086, alt: 3 }, name: 'Amsterdam Schiphol Airport' },
    { code: 'MAD', pos: { lon: -3.5676, lat: 40.4936, alt: 610 }, name: 'Adolfo Suárez Madrid–Barajas Airport' },
    { code: 'BCN', pos: { lon: 2.0785, lat: 41.2974, alt: 4 }, name: 'Barcelona–El Prat Airport' },
    { code: 'FCO', pos: { lon: 12.2508, lat: 41.8003, alt: 5 }, name: 'Leonardo da Vinci–Fiumicino Airport' },
    { code: 'MUC', pos: { lon: 11.7861, lat: 48.3538, alt: 453 }, name: 'Munich Airport' },
    { code: 'ZRH', pos: { lon: 8.5492, lat: 47.4647, alt: 432 }, name: 'Zurich Airport' },
    { code: 'VIE', pos: { lon: 16.5697, lat: 48.1103, alt: 183 }, name: 'Vienna International Airport' },
    { code: 'BRU', pos: { lon: 4.4844, lat: 50.9014, alt: 58 }, name: 'Brussels Airport' },
    { code: 'CPH', pos: { lon: 12.6508, lat: 55.6181, alt: 5 }, name: 'Copenhagen Airport' },
    { code: 'OSL', pos: { lon: 11.1004, lat: 60.1939, alt: 208 }, name: 'Oslo Gardermoen Airport' },
    { code: 'ARN', pos: { lon: 17.9186, lat: 59.6519, alt: 42 }, name: 'Stockholm Arlanda Airport' },
    { code: 'HEL', pos: { lon: 24.9633, lat: 60.3172, alt: 55 }, name: 'Helsinki Airport' },
    { code: 'DUB', pos: { lon: -6.2701, lat: 53.4213, alt: 74 }, name: 'Dublin Airport' },
    { code: 'LIS', pos: { lon: -9.1355, lat: 38.7742, alt: 114 }, name: 'Lisbon Airport' },
    { code: 'ATH', pos: { lon: 23.9445, lat: 37.9364, alt: 94 }, name: 'Athens International Airport' },
    { code: 'IST', pos: { lon: 28.8146, lat: 40.9769, alt: 99 }, name: 'Istanbul Airport' },
    { code: 'SVO', pos: { lon: 37.4146, lat: 55.9726, alt: 192 }, name: 'Sheremetyevo International Airport' },
    { code: 'LED', pos: { lon: 30.2625, lat: 59.8003, alt: 24 }, name: 'Pulkovo Airport' },
    { code: 'WAW', pos: { lon: 20.9671, lat: 52.1657, alt: 110 }, name: 'Warsaw Chopin Airport' },
    { code: 'PRG', pos: { lon: 14.2632, lat: 50.1008, alt: 380 }, name: 'Václav Havel Airport Prague' },
    { code: 'BUD', pos: { lon: 19.2611, lat: 47.4369, alt: 151 }, name: 'Budapest Ferenc Liszt International Airport' },
    { code: 'OTP', pos: { lon: 26.085, lat: 44.5711, alt: 95 }, name: 'Henri Coandă International Airport' },
    { code: 'SOF', pos: { lon: 23.4114, lat: 42.6952, alt: 531 }, name: 'Sofia Airport' },
    { code: 'BEG', pos: { lon: 20.3091, lat: 44.8184, alt: 102 }, name: 'Belgrade Nikola Tesla Airport' },
    { code: 'ZAG', pos: { lon: 16.0688, lat: 45.7429, alt: 108 }, name: 'Zagreb Airport' },
    { code: 'LJU', pos: { lon: 14.4576, lat: 46.2237, alt: 388 }, name: 'Ljubljana Jože Pučnik Airport' },
    { code: 'TIA', pos: { lon: 19.7206, lat: 41.4147, alt: 38 }, name: 'Tirana International Airport Nënë Tereza' },
    { code: 'SKG', pos: { lon: 22.9709, lat: 40.5197, alt: 7 }, name: 'Thessaloniki Airport' },
    { code: 'RIX', pos: { lon: 23.9711, lat: 56.9236, alt: 10 }, name: 'Riga International Airport' },
    { code: 'VNO', pos: { lon: 25.2858, lat: 54.6341, alt: 197 }, name: 'Vilnius Airport' },
    { code: 'TLL', pos: { lon: 24.8328, lat: 59.4133, alt: 40 }, name: 'Tallinn Airport' },
    { code: 'MSQ', pos: { lon: 28.0307, lat: 53.8825, alt: 204 }, name: 'Minsk National Airport' },
    { code: 'EVN', pos: { lon: 44.4009, lat: 40.1473, alt: 865 }, name: 'Zvartnots International Airport' },
    { code: 'GYD', pos: { lon: 50.0506, lat: 40.4675, alt: 3 }, name: 'Heydar Aliyev International Airport' },
    { code: 'TBS', pos: { lon: 44.9547, lat: 41.6692, alt: 495 }, name: 'Tbilisi International Airport' },
    { code: 'KBP', pos: { lon: 30.8947, lat: 50.345, alt: 130 }, name: 'Boryspil International Airport' },
    { code: 'ODS', pos: { lon: 30.6765, lat: 46.4268, alt: 40 }, name: 'Odesa International Airport' },
    { code: 'LWO', pos: { lon: 23.9561, lat: 49.8125, alt: 325 }, name: 'Lviv Danylo Halytskyi International Airport' },
    { code: 'KIV', pos: { lon: 28.9308, lat: 46.9277, alt: 122 }, name: 'Chișinău International Airport' },
    { code: 'MLA', pos: { lon: 14.4775, lat: 35.8575, alt: 91 }, name: 'Malta International Airport' },
    { code: 'LCA', pos: { lon: 33.6249, lat: 34.8751, alt: 8 }, name: 'Larnaca International Airport' },
    { code: 'PFO', pos: { lon: 32.4857, lat: 34.718, alt: 12 }, name: 'Paphos International Airport' },
    { code: 'HER', pos: { lon: 25.1803, lat: 35.3397, alt: 39 }, name: 'Heraklion International Airport' },
    { code: 'RHO', pos: { lon: 28.1633, lat: 36.4054, alt: 6 }, name: 'Rhodes International Airport' },
    { code: 'CFU', pos: { lon: 19.9117, lat: 39.6019, alt: 2 }, name: 'Corfu International Airport' },
  ];

  const planes = Array.from({ length: 10 }, () => generateRandomPlane(airportsData));

  return {
    width,
    height,
    airports: airportsData,
    planes: planes
  };
};

const updatePlane = (plane: Plane, timeSinceLastUpdate: number): Plane => {
  const { pos, arr } = plane;
  const newRotation = Math.atan2(arr.pos.lat - pos.lat, arr.pos.lon - pos.lon);
  const { lon, lat } = updatePlanePosition(pos.lon, pos.lat, plane.spd, newRotation, timeSinceLastUpdate);
  const hasArrived = Math.abs(lon - arr.pos.lon) < 0.1 && Math.abs(lat - arr.pos.lat) < 0.1;
  return {
    ...plane,
    pos: {
      ...plane.pos,
      lon,
      lat
    },
    rot: newRotation,
    hasArrived: hasArrived
  };
};

const updatePlanePosition = (lon: number, lat: number, spd: number, rot: number, t: number): { lon: number, lat: number } => {
  const R = 6371; // Earth's radius in km
  const t_hours = t / 3600000;
  const d = spd * t_hours;

  const deltaLat = (d * Math.sin(rot)) / R;
  const deltaLon = (d * Math.cos(rot)) / (R * Math.cos(lat * Math.PI / 180));
  const deltaLat_deg = deltaLat * (180 / Math.PI);
  const deltaLon_deg = deltaLon * (180 / Math.PI);
  const new_lat = lat + deltaLat_deg;
  const new_lon = lon + deltaLon_deg;

  return { lon: new_lon, lat: new_lat };
};

export const updateSkyMap = (skyMap: SkyMap | undefined, timeSinceLastUpdate: number): SkyMap => {
  if (!skyMap) {
    return {
      width: 0,
      height: 0,
      airports: [],
      planes: []
    };
  }
  const updatedPlanes = skyMap.planes.map((plane) => updatePlane(plane, timeSinceLastUpdate));
  const planes = updatedPlanes.filter((plane) => !plane.hasArrived);

  if (planes.length < 10 && Math.random() <= 0.05) {
    const airports = skyMap.airports;
    const newPlane = generateRandomPlane(airports);
    planes.push(newPlane);
  }

  return {
    ...skyMap,
    planes: planes
  };
};