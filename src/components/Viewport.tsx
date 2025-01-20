import {createContext, FC, ReactNode, useContext, useEffect, useRef, useState} from "react";
import { SkymapAppContext } from "../App";

interface ViewportContextProps {
  position: { x: number, y: number };
  zoom: number;
}

export const ViewportContext = createContext<ViewportContextProps>({ position: {x: 0, y: 0}, zoom: 1 });

interface ViewportProps {
  positionState: {position: { x: number, y: number }, setPosition: (pos: { x: number, y: number } | ((prevPosition: { x: number; y: number }) => { x: number; y: number })) => void};
  children: ReactNode;
  className?: string;
}

const Viewport: FC<ViewportProps> = ({positionState, children, className}) => {
  const skymapAppContext = useContext(SkymapAppContext);
  const viewportRef = useRef<HTMLDivElement>(null);

  const { position, setPosition } = positionState;

  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const eventTouchLastPos = useRef<{x: number, y: number} | null>(null);
  const initialPinchDistance = useRef<number | null>(null);

  const handleMouseDown = () => {
    setIsPanning(true);
    skymapAppContext.setUserSelectionActive(false);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isPanning) {
      setPosition((prevPosition: { x: number; y: number }) => ({
        x: prevPosition.x - event.movementX / zoom,
        y: prevPosition.y - event.movementY / zoom,
      }));
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 1) {
      if (eventTouchLastPos.current === null) {
        eventTouchLastPos.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
      if (isPanning) {
        const deltaX = eventTouchLastPos.current.x - event.touches[0].clientX;
        const deltaY = eventTouchLastPos.current.y - event.touches[0].clientY;

        setPosition((prevPosition: { x: number; y: number }) => ({
          x: prevPosition.x + deltaX  / zoom,
          y: prevPosition.y + deltaY / zoom,
        }));
        eventTouchLastPos.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
    } else if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      if (initialPinchDistance.current === null) {
        initialPinchDistance.current = currentDistance;
      } else {
        const scale = currentDistance / initialPinchDistance.current;
        setZoom((prevZoom) => {
          const newZoom = prevZoom * scale;
          return parseFloat(Math.min(Math.max(newZoom, 0.5), 2).toFixed(2)); // Clamping between 0.5 and 2
        });
        initialPinchDistance.current = currentDistance;
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    eventTouchLastPos.current = null;
    initialPinchDistance.current = null;
    skymapAppContext.setUserSelectionActive(true);
  };

  const handleWheel = (event: WheelEvent) => {
    setZoom((prevZoom) => {
      const newZoom = prevZoom - event.deltaY * 0.001;
      return parseFloat(Math.min(Math.max(newZoom, 0.5), 2).toFixed(2)); // Clamping between 0.5 and 2
    });
    event.preventDefault();
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", (event: TouchEvent) => handleTouchMove(event as unknown as React.TouchEvent<HTMLDivElement>));
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", (event: TouchEvent) => handleTouchMove(event as unknown as React.TouchEvent<HTMLDivElement>));
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isPanning]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (viewportRef.current) {
        viewportRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <div ref = {viewportRef}
         onMouseDown={handleMouseDown}
         className={className}
         style={{
           width: "100%",
           height: "100%",
           overflow: "hidden",
           cursor: isPanning ? "grabbing" : "grab",
         }}
         onTouchStart={handleMouseDown}
    >
      <ViewportContext.Provider value={{ position, zoom }}>
        {children}
        <p>Position: {position.x}, {position.y}</p>
        <p>Zoom: {zoom}</p>
      </ViewportContext.Provider>
    </div>
  );
}

export default Viewport;