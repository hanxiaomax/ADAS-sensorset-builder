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
      length: 4.8, // Length in meters
      width: 1.9, // Width in meters
      frontOverhang: 45, // Front overhang in pixels
      rearOverhang: 45, // Rear overhang in pixels
    };
  }

  // SUV has different reference point positions
  protected initializeRefPoints(): VehicleRefPoints {
    const refPoints = super.initializeRefPoints();

    // Modify specific reference points for SUV
    refPoints.roof_top = setPosition(
      this.origin.x + this.width / 2,
      this.origin.y + this.length / 2 - 30 // Higher roof position for SUV
    );

    refPoints.front_windsheild = setPosition(
      this.origin.x + this.width / 2,
      this.origin.y + 150 // Adjusted windshield position for SUV
    );

    refPoints.rear_windsheild = setPosition(
      this.origin.x + this.width / 2,
      this.origin.y + this.length - 90 // Adjusted rear window position for SUV
    );

    return refPoints;
  }

  // SUV may have additional or different mounting points
  protected initializeMountingPoints(): Mounts {
    const mountingPoints = super.initializeMountingPoints();

    // Add SUV-specific mounting points
    return mountingPoints;
  }
}
