import { FC, useContext, useMemo } from "react";
import { Container } from "@pixi/react";
import { ViewportContext } from "./Viewport.tsx";
import SkyMap, { normalizeCoordinates } from "../models/SkyMap.tsx";
import PlaneSprite from "./PlaneSprite.tsx";
import AirportSprite from "./AirportSprite.tsx";
import ContextStage from "./ContextStage.tsx";
import { SkymapAppContext } from "../App.tsx";

interface SkyMapViewerProps {
  width: number;
  height: number;
  skyMap: SkyMap;
}

const SkyMapViewer: FC<SkyMapViewerProps> = ({ width, height, skyMap }) => {
  const viewportContext = useContext(ViewportContext);


  const coordinateRange = useMemo(() => {
    const minLat = Math.min(...skyMap.airports.map((a) => a.pos.lat));
    const maxLat = Math.max(...skyMap.airports.map((a) => a.pos.lat));
    const minLon = Math.min(...skyMap.airports.map((a) => a.pos.lon));
    const maxLon = Math.max(...skyMap.airports.map((a) => a.pos.lon));

    return { minLat, maxLat, minLon, maxLon };
  }, [skyMap]);

  return (
    <div className={"skymap"}>
      <ContextStage
        context={SkymapAppContext}
        stageProps={{
          options: { background: 0x87CEEB, antialias: true },
          width: width,
          height: height
        }}
      >
        <Container anchor={0.5} >
          {skyMap.airports.map((airport) => {
            const normalizedPos = normalizeCoordinates(
              coordinateRange,
              { width: skyMap.width, height: skyMap.height },
              { lon: airport.pos.lon, lat: airport.pos.lat }
            );

            return (
              <AirportSprite key={airport.code}
                airport={airport}
                pos={{ x: (normalizedPos.x - viewportContext.position.x) * viewportContext.zoom, y: (normalizedPos.y - viewportContext.position.y) * viewportContext.zoom }}
                scale={viewportContext.zoom}
              />
            );
          })}
        </Container>
        <Container anchor={0.5}>
          {skyMap.planes.map((plane) => {
            const normalizedPos = normalizeCoordinates(
              coordinateRange,
              { width: skyMap.width, height: skyMap.height },
              { lon: plane.pos.lon, lat: plane.pos.lat }
            );

            return (
              <PlaneSprite
                key={plane.id}
                plane={plane}
                pos={{ x: (normalizedPos.x - viewportContext.position.x) * viewportContext.zoom, y: (normalizedPos.y - viewportContext.position.y) * viewportContext.zoom }}
                rotation={plane.rot} // Adjust rotation by 90 degrees
                scale={viewportContext.zoom}
              />
            );
          })}
        </Container>
      </ContextStage>
    </div>
  );
}

export default SkyMapViewer;