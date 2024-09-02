import { Position, MountPosition } from "./Common";
function setPosition(x: number, y: number): Position {
  return {
    x: x,
    y: y,
  };
}

function setMountingPosition(
  x: number,
  y: number,
  orientation: number
): MountPosition {
  return {
    name: "",
    position: setPosition(x, y),
    orientation: orientation,
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

export interface Mounts {
  [key: string]: MountPosition;
}

export class Vehicle {
  width: number;
  length: number;
  frontOverhang: number;
  rearOverhang: number;
  origin: Position;
  refPoints: VehicleRefPoints;
  orientation_front: number = -90;
  orientation_rear: number = 90;
  image: HTMLImageElement | undefined;
  _mountingPoints: Mounts;

  constructor(
    stageSize: { width: number; height: number },
    image: HTMLImageElement | undefined
  ) {
    this.image = image;
    const image_margin = 20;
    const overhang = 60 + image_margin;
    const origin: Position = {
      x: (stageSize.width - image?.width!) / 2,
      y: (stageSize.height - image?.height!) / 2,
    };

    this.image = image;
    this.width = image?.width!;
    this.length = image?.height!;
    this.frontOverhang = overhang / 2;
    this.rearOverhang = overhang / 2;
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

    this._mountingPoints = {
      front_middle_right1: setMountingPosition(
        this.refPoints.front_center.x + 20,
        this.refPoints.front_center.y + 5,
        this.orientation_front
      ),
      front_middle_right2: setMountingPosition(
        this.refPoints.front_center.x + 45,
        this.refPoints.front_center.y + 13,
        this.orientation_front + 20
      ),

      front_middle_left1: setMountingPosition(
        this.refPoints.front_center.x - 20,
        this.refPoints.front_center.y + 5,
        this.orientation_front
      ),
      front_middle_left2: setMountingPosition(
        this.refPoints.front_center.x - 45,
        this.refPoints.front_center.y + 13,
        this.orientation_front - 20
      ),
      front_right_side: setMountingPosition(
        this.refPoints.front_bumper_right.x - 5,
        this.refPoints.front_bumper_right.y,
        0
      ),
      front_left_side: setMountingPosition(
        this.refPoints.front_bumper_left.x + 5,
        this.refPoints.front_bumper_left.y,
        180
      ),
      rear_middle_right1: setMountingPosition(
        this.refPoints.rear_center.x + 20,
        this.refPoints.rear_center.y - 5,
        this.orientation_rear
      ),
      rear_middle_right2: setMountingPosition(
        this.refPoints.rear_center.x + 45,
        this.refPoints.rear_center.y - 13,
        this.orientation_rear - 20
      ),
      rear_middle_left1: setMountingPosition(
        this.refPoints.rear_center.x - 20,
        this.refPoints.rear_center.y - 5,
        this.orientation_rear
      ),
      rear_middle_left2: setMountingPosition(
        this.refPoints.rear_center.x - 45,
        this.refPoints.rear_center.y - 13,
        this.orientation_rear + 20
      ),
      rear_right_side: setMountingPosition(
        this.refPoints.rear_bumper_right.x - 5,
        this.refPoints.rear_bumper_right.y,
        0
      ),
      rear_left_side: setMountingPosition(
        this.refPoints.rear_bumper_left.x + 5,
        this.refPoints.rear_bumper_left.y,
        180
      ),
      roof_top: setMountingPosition(
        this.refPoints.roof_top.x,
        this.refPoints.roof_top.y,
        this.orientation_front
      ),

      front_left_corner: setMountingPosition(
        this.refPoints.front_bumper_left.x,
        this.refPoints.front_bumper_left.y,
        -120
      ),
      front_right_corner: setMountingPosition(
        this.refPoints.front_bumper_right.x,
        this.refPoints.front_bumper_right.y,
        -60
      ),
      rear_left_corner: setMountingPosition(
        this.refPoints.rear_bumper_left.x,
        this.refPoints.rear_bumper_left.y,
        120
      ),
      rear_right_corner: setMountingPosition(
        this.refPoints.rear_bumper_right.x,
        this.refPoints.rear_bumper_right.y,
        60
      ),
      front_windshield: setMountingPosition(
        this.refPoints.front_windsheild.x,
        this.refPoints.front_windsheild.y,
        -90
      ),
      rear_windshield: setMountingPosition(
        this.refPoints.rear_windsheild.x,
        this.refPoints.rear_windsheild.y,
        90
      ),
      wingside_left: setMountingPosition(
        this.refPoints.wingside_left.x,
        this.refPoints.wingside_left.y,
        -180
      ),
      wingside_right: setMountingPosition(
        this.refPoints.wingside_right.x,
        this.refPoints.wingside_right.y,
        0
      ),
      b_pillar_left: setMountingPosition(
        this.refPoints.b_pillar_left.x,
        this.refPoints.b_pillar_left.y,
        -180
      ),
      b_pillar_right: setMountingPosition(
        this.refPoints.b_pillar_right.x,
        this.refPoints.b_pillar_right.y,
        0
      ),
    };
  }
}
