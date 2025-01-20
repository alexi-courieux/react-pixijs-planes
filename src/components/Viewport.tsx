import {createContext, FC, ReactNode, useEffect, useRef, useState} from "react";

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
  const viewportRef = useRef<HTMLDivElement>(null);

  const { position, setPosition } = positionState;

  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const eventTouchStartPos = useRef<{x: number, y: number} | null>(null);

  const handleMouseDown = () => {
    setIsPanning(true);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isPanning) {
      setPosition((prevPosition: { x: number; y: number }) => ({
        x: prevPosition.x - event.movementX * (1 / zoom),
        y: prevPosition.y - event.movementY * (1 / zoom),
      }));
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (eventTouchStartPos.current === null) {
      eventTouchStartPos.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    if (isPanning) {
      const deltaX = event.touches[0].clientX - eventTouchStartPos.current.x;
      const deltaY = event.touches[0].clientY - eventTouchStartPos.current.y;

      console.log(`dx: ${deltaX}, dy: ${deltaY}, start: ${eventTouchStartPos.current.x}, ${eventTouchStartPos.current.y}`);
      setPosition((prevPosition: { x: number; y: number }) => ({
        x: prevPosition.x + deltaX * (0.1 / zoom),
        y: prevPosition.y + deltaY * (0.1 / zoom),
      }));
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false);
    eventTouchStartPos.current = null
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