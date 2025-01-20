import {createContext, FC, ReactNode, useEffect, useRef, useState} from "react";

interface ViewportContextProps {
  position: { x: number, y: number };
  zoom: number;
}

export const ViewportContext = createContext<ViewportContextProps>({ position: {x: 0, y: 0}, zoom: 1 });

interface ViewportProps {
  children: ReactNode;
}

const Viewport: FC<ViewportProps> = ({children}) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  const handleMouseDown = () => {
    setIsPanning(true);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isPanning) {
      setPosition((prevPosition) => ({
        x: prevPosition.x - event.movementX * (1 / zoom),
        y: prevPosition.y - event.movementY * (1 / zoom),
      }));
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (isPanning) {
      setPosition((prevPosition) => ({
        x: prevPosition.x - event.touches[0].clientX * 0.1 * (1 / zoom),
        y: prevPosition.y - event.touches[0].clientY * 0.1 * (1 / zoom),
      }));
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (event: WheelEvent) => {
    setZoom((prevZoom) => {
      const newZoom = prevZoom - event.deltaY * 0.001;
      return parseFloat(Math.min(Math.max(newZoom, 0.5), 2).toFixed(2)); // Clamping between 0.5 and 2
    });
    event.preventDefault();
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
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