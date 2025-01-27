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

const appWidth = window.innerWidth
const appHeight = window.innerHeight

const app = new PIXI.Application({
  width: appWidth,
  height: appHeight,
  backgroundColor: 0x87CEEB
});

interface SkymapAppContextProps {
  selectPlane: (plane: Plane) => void;
  selectAirport: (airport: Airport) => void;
  setUserSelectionActive: (userSelectionActive: boolean) => void;
}

export const SkymapAppContext = createContext<SkymapAppContextProps>({
  selectPlane: (_plane: Plane) => {},
  selectAirport: (_airport: Airport) => {},
  setUserSelectionActive: (_userSelectionActive: boolean) => {}
});

const App: FC = () => {

  const [skyMap, setSkyMap] = useState<SkyMap>(() => generateRandomSkyMap(1000, 1000));
  const [simulationSpeed, setSimulationSpeed] = useState(10);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const intervalRef = useRef<number | null>(null);

  const [selectedPlaneId, setSelectedPlaneId] = useState<string | undefined>(undefined);
  const [selectedAirportCode, setSelectedAirportCode] = useState<string | undefined>(undefined);
  const [userSelectionActive, setUserSelectionActive] = useState<boolean>(false);

  const updateMap = (lastUpdate: number) => {
    setSkyMap((prevSkyMap) => updateSkyMap(prevSkyMap, lastUpdate));
  };

  const handlePlaneSelection = useCallback((plane: Plane) => {
    setSelectedPlaneId(plane.id);
  }, []);

  const handleAirportSelection = useCallback((airport: Airport) => {
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
    <div className={!userSelectionActive ? "no-select" : ""}>
      <SkymapAppContext.Provider value={{ selectPlane: handlePlaneSelection, selectAirport: handleAirportSelection, setUserSelectionActive: setUserSelectionActive  }}>
        <AppProvider value={app}>
          <Grid2 container spacing={2} sx={{position:"relative"}}>
            <Grid2 size={"grow"}>
              <Viewport positionState={{position, setPosition}}>
                <SkyMapViewer width={appWidth - 20} height={appHeight - 200} skyMap={skyMap}/>
              </Viewport>
              <div className="slidecontainer">
                <input type="range" min="1" max="100" value={simulationSpeed} className="slider" id="simulationSpeedSlider"
                       onChange={(event) => setSimulationSpeed(parseInt(event.target.value))}/>
                <label htmlFor="simulationSpeedSlider">Simulation Speed : {simulationSpeed}</label>
              </div>
            </Grid2>
            {(selectedPlaneId || selectedAirportCode) && (
              <Grid2 container spacing={"16px"} sx={{width: 400, maxWidth: "80%", position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)"}}>
                <InfoPanel sx={{width: "100%"}}
                  plane={skyMap.planes.find((plane) => plane.id === selectedPlaneId)}
                  onClose={() => setSelectedPlaneId(undefined)}
                  onAirportSelected={(airport: Airport) => setSelectedAirportCode(airport.code)}
                />
                <InfoPanel sx={{width: "100%"}}
                  airport={skyMap.airports.find((airport) => airport.code === selectedAirportCode)}
                  onClose={() => setSelectedAirportCode(undefined)}
                />
              </Grid2>
          )}
          </Grid2>
        </AppProvider>
      </SkymapAppContext.Provider>
    </div>
  );
};

export default App;
