import { Position } from "./Common";

function setPosition(x: number, y: number): Position {
  return {
    x: x,
    y: y,
  };
}

export interface VehicleRefPoints {
  front_center: Position;
  rear_center: Position;
  front_bumper_right: Position;
  front_bumper_left: Position;
  rear_bumper_right: Position;
  rear_bumper_left: Position;
  wingside_right: Position;
  wingside_left: Position;
  sidemirror_right: Position;
  sidemirror_left: Position;
  front_roof: Position;
  front_windsheild: Position;
  rear_windsheild: Position;
  b_pillar_right: Position;
  b_pillar_left: Position;
  roof_top: Position;
}

export class Vehicle {
  width: number;
  length: number;
  frontOverhang: number;
  rearOverhang: number;
  origin: Position;
  refPoints: VehicleRefPoints;

  constructor(
    width: number,
    length: number,
    frontOverhang: number,
    rearOverhang: number,
    origin: Position
  ) {
    this.width = width;
    this.length = length;
    this.frontOverhang = frontOverhang;
    this.rearOverhang = rearOverhang;
    this.origin = origin;
    this.refPoints = {
      front_center: setPosition(this.origin.x + this.width / 2, this.origin.y),
      rear_center: setPosition(
        this.origin.x + this.width / 2,
        this.origin.y + this.length
      ),
      front_bumper_right: setPosition(
        this.origin.x + this.width - 15,
        this.origin.y + 30
      ),
      front_bumper_left: setPosition(this.origin.x + 15, this.origin.y + 30),
      rear_bumper_right: setPosition(
        this.origin.x + this.width - 15,
        this.origin.y + this.length - 30
      ),
      rear_bumper_left: setPosition(
        this.origin.x + 15,
        this.origin.y + this.length - 30
      ),
      wingside_right: setPosition(
        this.origin.x + this.width - 15,
        this.origin.y + 100
      ),
      wingside_left: setPosition(this.origin.x + 15, this.origin.y + 100),
      sidemirror_right: setPosition(
        this.origin.x + this.width - 8,
        this.origin.y + 120
      ),
      sidemirror_left: setPosition(this.origin.x + 8, this.origin.y + 120),
      front_roof: setPosition(
        this.origin.x + 15,
        this.origin.y + this.length - 30
      ),
      front_windsheild: setPosition(
        this.origin.x + this.width / 2,
        this.origin.y + 130
      ),
      rear_windsheild: setPosition(
        this.origin.x + this.width / 2,
        this.origin.y + this.length - 70
      ),
      b_pillar_right: setPosition(
        this.origin.x + this.width - 15,
        this.origin.y + 180
      ),
      b_pillar_left: setPosition(this.origin.x + 15, this.origin.y + 180),
      roof_top: setPosition(
        this.origin.x + this.width / 2,
        this.origin.y + this.length / 2
      ),
    };
  }
}
