import {
  Vehicle,
  VehicleDimensions,
  VehicleRefPoints,
  Mounts,
} from "../Vehicle";
import { Position } from "../Common";

function setPosition(x: number, y: number): Position {
  return { x, y };
}

export class SuvVehicle extends Vehicle {
  readonly imagePath = process.env.PUBLIC_URL + "/vehicles/vehicle2.svg";

  protected getVehicleDimensions(): VehicleDimensions {
    return {
      length: 4.8, // SUV长度 4.8 meters
      width: 1.9, // SUV宽度 1.9 meters
      frontOverhang: 45, // 前悬 45 pixels
      rearOverhang: 45, // 后悬 45 pixels
    };
  }

  // SUV有不同的参考点位置
  protected initializeRefPoints(): VehicleRefPoints {
    const baseRefPoints = super.initializeRefPoints();
    return {
      ...baseRefPoints,
      // 修改一些特定于SUV的参考点
      roof_top: setPosition(
        this.origin.x + this.width / 2,
        this.origin.y + this.length / 2 - 30 // SUV车顶位置更高
      ),
      front_windsheild: setPosition(
        this.origin.x + this.width / 2,
        this.origin.y + 150 // SUV前挡风玻璃位置调整
      ),
      rear_windsheild: setPosition(
        this.origin.x + this.width / 2,
        this.origin.y + this.length - 90 // SUV后挡风玻璃位置调整
      ),
    };
  }

  // SUV可能有一些额外的或不同的挂载点
  protected initializeMountingPoints(): Mounts {
    const baseMountingPoints = super.initializeMountingPoints();
    return {
      ...baseMountingPoints,
      // 添加SUV特有的挂载点
      roof_rack_front: {
        name: "roof_rack_front",
        position: setPosition(
          this.origin.x + this.width / 2,
          this.origin.y + this.length / 3
        ),
        orientation: this.orientation_front,
      },
      roof_rack_rear: {
        name: "roof_rack_rear",
        position: setPosition(
          this.origin.x + this.width / 2,
          this.origin.y + (this.length * 2) / 3
        ),
        orientation: this.orientation_rear,
      },
    };
  }
}
