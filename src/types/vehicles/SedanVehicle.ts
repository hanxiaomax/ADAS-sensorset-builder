import { Vehicle, VehicleDimensions } from "../Vehicle";

export class SedanVehicle extends Vehicle {
  readonly imagePath = process.env.PUBLIC_URL + "/vehicles/vehicle3.png";

  protected getVehicleDimensions(): VehicleDimensions {
    return {
      length: 4.5, // 轿车长度 4.5 meters
      width: 2, // 轿车宽度 1.8 meters
      frontOverhang: 40, // 前悬 40 pixels
      rearOverhang: 40, // 后悬 40 pixels
    };
  }

  // 如果需要自定义参考点，可以覆盖initializeRefPoints方法
  // protected initializeRefPoints(): VehicleRefPoints {
  //   return {
  //     ...super.initializeRefPoints(),
  //     // 自定义或修改某些参考点
  //   };
  // }

  // 如果需要自定义挂载点，可以覆盖initializeMountingPoints方法
  // protected initializeMountingPoints(): Mounts {
  //   return {
  //     ...super.initializeMountingPoints(),
  //     // 自定义或修改某些挂载点
  //   };
  // }
}
