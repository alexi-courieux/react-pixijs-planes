// PlaneSprite.tsx
import {FC, useContext} from "react";
import { Container, Sprite, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import Plane from "../models/Plane.tsx";
import {SkymapAppContext} from "../App.tsx";

interface PlaneSpriteProps {
  plane: Plane;
  pos: { x: number, y: number };
  scale: number;
}

const PlaneSprite: FC<PlaneSpriteProps> = ({ plane, pos, scale }) => {
  const textStyle = new TextStyle({
    fontFamily: "Roboto, sans-serif",
    fontSize: "3em",
    fill: "#000000",
  });

  const { selectPlane } = useContext(SkymapAppContext);

  return (
    <Container x={pos.x} y={pos.y} key={plane.id}>
      <Sprite
        image={'/pixijs-react/images/plane.svg'}
        anchor={0.5}
        scale={0.3 * scale}
        eventMode="static"
        pointerdown={() => {
          selectPlane(plane)
        }}
      />
      <Text
        anchor={{ x: 0.5, y: -2.5 }}
        text={`${plane.id}`}
        scale={Math.max(0.4, 0.4 * scale)}
        style={textStyle}
      />
    </Container>
  );
};

export default PlaneSprite;