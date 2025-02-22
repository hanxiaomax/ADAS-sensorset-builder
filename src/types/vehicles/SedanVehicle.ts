import { Vehicle, VehicleDimensions } from "../Vehicle";

export class SedanVehicle extends Vehicle {
  readonly imagePath = process.env.PUBLIC_URL + "/vehicles/vehicle3.png";

  protected getVehicleDimensions(): VehicleDimensions {
    return {
      length: 4.5, // Length in meters
      width: 2, // Width in meters
      frontOverhang: 40, // Front overhang in pixels
      rearOverhang: 40, // Rear overhang in pixels
    };
  }

  // Override initializeRefPoints method to customize reference points if needed
  // protected initializeRefPoints(): VehicleRefPoints {
  //   return {
  //     ...super.initializeRefPoints(),
  //     // Customize or modify specific reference points
  //   };
  // }

  // Override initializeMountingPoints method to customize mounting points if needed
  // protected initializeMountingPoints(): Mounts {
  //   return {
  //     ...super.initializeMountingPoints(),
  //     // Customize or modify specific mounting points
  //   };
  // }
}
