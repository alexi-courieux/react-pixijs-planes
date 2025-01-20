// AirportSprite.tsx
import {FC, useContext} from "react";
import { Container, Sprite, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import Airport from "../models/Airport.tsx";
import {SkymapAppContext} from "../App.tsx";

interface AirportSpriteProps {
  airport: Airport;
  pos: { x: number, y: number };
  scale: number;
}

const AirportSprite: FC<AirportSpriteProps> = ({ airport, pos, scale }) => {
  const textStyle = new TextStyle({
    fontFamily: "Roboto, sans-serif",
    fontSize: 24,
    fill: "#000000",
  });

  const { selectAirport } = useContext(SkymapAppContext);

  return (
    <Container x={pos.x} y={pos.y} key={airport.code}>
      <Sprite
        image={'/pixijs-react/images/point.svg'}
        anchor={0.5}
        scale={0.1 * scale}
        eventMode="static"
        pointerdown={() => {
          selectAirport(airport)
        }}
      />
      <Text
        anchor={{ x: 0.5, y: -1 }}
        text={airport.code}
        scale={Math.max(0.5, 0.5 * scale)}
        style={textStyle}
      />
    </Container>
  );
};

export default AirportSprite;