import { FC, useRef } from "react";
import { Card, CardContent, Typography, IconButton, SxProps, Theme, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Plane from "../models/Plane.tsx";
import Airport from "../models/Airport.tsx";
import Draggable from "react-draggable";

interface InfoPanelProps {
  plane?: Plane;
  airport?: Airport;
  onClose: () => void;
  onAirportSelected?: (airport: Airport) => void
  sx?: SxProps<Theme>;
}

const InfoPanel: FC<InfoPanelProps> = ({ plane, airport, onClose, onAirportSelected, sx }) => {
  const draggableRef = useRef(null);

  const handleClickDeparture = () => {
    onAirportSelected?.(plane!.dep);
  }

  const handleClickArrival = () => {
    onAirportSelected?.(plane!.arr);
  }

  if (!plane && !airport) {
    return null;
  }

  let content = null;

  if (plane) {
    content = (
      <>
        <Typography gutterBottom variant="h5" component="div">
          Plane Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {plane.id}
        </Typography>
        <Card variant="outlined" sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Position:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lat: {plane.pos.lat.toFixed(4)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lon: {plane.pos.lon.toFixed(4)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Altitude: {plane.pos.alt} m
            </Typography>
          </CardContent>
        </Card>
        <Typography variant="body2" color="text.secondary">
          Rotation: {(plane.rot * 180 / Math.PI).toFixed(2)}° degrees
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Speed: {plane.spd} km/h
        </Typography>
        <Button variant="text" onClick={handleClickDeparture}>
          Departure: {plane.dep.name} ({plane.dep.code})
        </Button>
        <Button variant="text" onClick={handleClickArrival}>
          Arrival: {plane.arr.name} ({plane.arr.code})
        </Button>
      </>
    );
  }

  if (airport) {
    content = (
      <>
        <Typography gutterBottom variant="h5" component="div">
          Airport Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Code: {airport.code}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Name: {airport.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Position: Lat {airport.pos.lat}, Lon {airport.pos.lon}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Altitude: {airport.pos.alt} m
        </Typography>
      </>
    );
  }

  return (
    <Draggable nodeRef={draggableRef}>
      <Card ref={draggableRef} sx={sx}>
        <CardContent sx={{
          position: 'relative',
          padding: 2,
          height: '100%'
        }}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          {content}
        </CardContent>
      </Card>
    </Draggable>
  );
};

export default InfoPanel;
