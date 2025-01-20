import './App.css';
import {createContext, FC, useEffect, useRef, useState, useCallback} from 'react';
import {AppProvider} from "@pixi/react";
import * as PIXI from 'pixi.js';
import Viewport from "./components/Viewport.tsx";
import SkyMapViewer from "./components/SkyMapViewer.tsx";
import SkyMap, {generateRandomSkyMap, updateSkyMap} from "./models/SkyMap.tsx";
import Plane from "./models/Plane.tsx";
import {Grid2} from "@mui/material";
import InfoPanel from "./components/InfoPanel.tsx";
import Airport from "./models/Airport.tsx";

const appWidth = 1600
const appHeight = 700

const app = new PIXI.Application({
  width: appWidth,
  height: appHeight,
  backgroundColor: 0x87CEEB
});

interface SkymapAppContextProps {
  selectPlane: (plane: Plane) => void;
  selectAirport: (airport: Airport) => void;
}

export const SkymapAppContext = createContext<SkymapAppContextProps>({
  selectPlane: (_plane: Plane) => {},
  selectAirport: (_airport: Airport) => {}
});

const App: FC = () => {

  const [skyMap, setSkyMap] = useState<SkyMap>(() => generateRandomSkyMap(2000, 2000));
  const [simulationSpeed, setSimulationSpeed] = useState(10);
  const intervalRef = useRef<number | null>(null);

  const [selectedPlaneId, setSelectedPlaneId] = useState<string | undefined>(undefined);
  const [selectedAirportCode, setSelectedAirportCode] = useState<string | undefined>(undefined);

  const updateMap = (lastUpdate: number) => {
    setSkyMap((prevSkyMap) => updateSkyMap(prevSkyMap, lastUpdate));
  };

  const handlePlaneSelection = useCallback((plane: Plane) => {
    console.log(`Plane ${plane.id} selected`);
    setSelectedPlaneId(plane.id);
  }, []);

  const handleAirportSelection = useCallback((airport: Airport) => {
    console.log(`Airport ${airport.code} selected`);
    setSelectedAirportCode(airport.code);
  }, []);

  useEffect(() => {
    const updateInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        updateMap(1000 * simulationSpeed);
      }, 1000 / simulationSpeed);
    };

    updateInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [simulationSpeed]);

  return (
    <SkymapAppContext.Provider value={{ selectPlane: handlePlaneSelection, selectAirport: handleAirportSelection }}>
      <AppProvider value={app}>
        <Grid2 container spacing={2}>
          <Grid2 size={"grow"}>
            <Viewport>
              <SkyMapViewer width={appWidth} height={appHeight} skyMap={skyMap}/>
            </Viewport>
            <div className="slidecontainer">
              <input type="range" min="1" max="100" value={simulationSpeed} className="slider" id="simulationSpeedSlider"
                     onChange={(event) => setSimulationSpeed(parseInt(event.target.value))}/>
              <label htmlFor="simulationSpeedSlider">Simulation Speed : {simulationSpeed}</label>
            </div>
          </Grid2>
          {(selectedPlaneId || selectedAirportCode) && (
            <Grid2 sx={{width: 400}}>
              <InfoPanel
                plane={skyMap.planes.find((plane) => plane.id === selectedPlaneId)}
                onClose={() => setSelectedPlaneId(undefined)}
              />
              <InfoPanel
                airport={skyMap.airports.find((airport) => airport.code === selectedAirportCode)}
                onClose={() => setSelectedAirportCode(undefined)}
              />
            </Grid2>
        )}
        </Grid2>
      </AppProvider>
    </SkymapAppContext.Provider>
  );
};

export default App;