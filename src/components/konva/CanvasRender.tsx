import React, { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Path,
  Text,
  Image,
  Arrow,
  Ellipse,
  Group,
  Shape as KonvaShape,
} from "react-konva";
import {
  Shape,
  Layer as SceneLayer,
  Vehicle,
  Group as SceneGroup,
  Point,
  MountingPoint,
  SceneObject,
} from "../../stores/models";
import Konva from "konva";
import useSceneStore from "../../stores/sceneStore";

const CanvasRenderer: React.FC = () => {
  const { scene, updateScene, updateShape } = useSceneStore();
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const [viewPort, setViewPort] = useState({ x: 0, y: 0, zoom: 1 }); // 初始视口位置和缩放
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 }); // 存储最后鼠标位置

  const handleDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const shapeNode = e.target;
    if (shapeNode && shapeNode.id()) {
      const draggedShape = scene.shapes.find(
        (shape) => shape.id === shapeNode.id()
      );
      if (draggedShape) {
        const updatedShape = {
          ...draggedShape,
          x: shapeNode.x(),
          y: shapeNode.y(),
        };
        updateShape(updatedShape);
      }
    }
  };
  const handleShapeClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const shapeNode = e.target;
    if (shapeNode && shapeNode.id()) {
      setSelectedShapeId(shapeNode.id());
    }
  };
  const renderShape = (shape: Shape) => {
    const commonProps = {
      key: shape.id,
      id: shape.id,
      x: shape.x,
      y: shape.y,
      // x: (shape.x || 0) * viewPort.zoom + viewPort.x,
      //y: (shape.y || 0) * viewPort.zoom + viewPort.y,
      draggable: shape.draggable,
      zIndex: shape.zIndex,
      stroke: shape.stroke,
      fill: shape.fill,
      strokeWidth: shape.strokeWidth,
      onClick: handleShapeClick,
      onDragEnd: handleDragEnd,
      // scaleX: viewPort.zoom,
      //scaleY: viewPort.zoom,
    };
    switch (shape.type) {
      case "rect":
        return (
          <Rect {...commonProps} width={shape.width} height={shape.height} />
        );
      case "circle":
        return <Circle {...commonProps} radius={shape.radius} />;
      case "line":
        return (
          <Line
            {...commonProps}
            points={shape.points?.flatMap((p) => [p.x, p.y]) || []}
            lineCap={shape.lineCap}
            lineDash={shape.lineDash}
          />
        );
      case "path":
        return <Path {...commonProps} data={shape.data} />;
      case "text":
        return (
          <Text
            {...commonProps}
            text={shape.text}
            fontSize={shape.fontSize}
            fontFamily={shape.fontFamily}
          />
        );
      // case "image": {
      //   const imageRef = React.useRef<Konva.Image>(null);
      //   React.useEffect(() => {
      //     const konvaImage = new window.Image();
      //     konvaImage.src = shape.src || "";
      //     konvaImage.onload = () => {
      //       if (imageRef.current) {
      //         imageRef.current.image(konvaImage); // 更新 image 属性
      //       }
      //     };
      //   }, []);
      //   return (
      //     <Image
      //       {...commonProps}
      //       width={shape.width}
      //       height={shape.height}
      //       image={null}
      //       ref={imageRef}
      //     />
      //   );
      // }
      case "arrow":
        return (
          <Arrow
            {...commonProps}
            points={shape.points?.flatMap((p) => [p.x, p.y]) || []}
            pointerLength={10}
            pointerWidth={10}
          />
        );
      // case "polygon":
      //   return (
      //     <Polygon
      //       {...commonProps}
      //       points={shape.points?.flatMap((p) => [p.x, p.y]) || []}
      //     />
      //   );
      case "ellipse":
        return (
          <Ellipse
            {...commonProps}
            radiusX={shape.radiusX}
            radiusY={shape.radiusY}
          />
        );
      case "group": {
        const g = shape as SceneGroup;
        return (
          <Group {...commonProps}>
            {g.children.map((childId) => {
              const child = scene.shapes.find((s) => s.id === childId);
              if (child) {
                return renderShape(child);
              }
              return null;
            })}
          </Group>
        );
      }
      default:
        return null;
    }
  };
  const renderMountingPoints = (vehicle: Vehicle) => {
    if (!vehicle.mountingPoints) return null;
    return Object.values(vehicle.mountingPoints).map((point: MountingPoint) => {
      return (
        <Circle
          key={point.name}
          x={vehicle.x! + point.position.x}
          y={vehicle.y! + point.position.y}
          radius={5}
          fill="yellow"
          stroke="black"
          strokeWidth={1}
        />
      );
    });
  };
  const renderVehicle = (vehicle: Vehicle) => {
    return (
      <React.Fragment key={vehicle.id}>
        <Rect
          key={vehicle.id + "rect"}
          x={vehicle.x || 0}
          y={vehicle.y || 0}
          width={50}
          height={20}
          fill="grey"
          rotation={vehicle.rotation}
          draggable={vehicle.draggable}
          onDragEnd={handleDragEnd}
          onClick={handleShapeClick}
          id={vehicle.id}
        />
        {renderMountingPoints(vehicle)}
      </React.Fragment>
    );
  };
  const renderSceneObject = (sceneObject: SceneObject) => {
    return renderShape(sceneObject);
  };
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const stage = stageRef.current;
    if (stage) {
      const scaleBy = 1.1;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (pointer) {
        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        // 限制缩放范围
        const minScale = 0.1;
        const maxScale = 5;
        const limitedScale = Math.max(minScale, Math.min(maxScale, newScale));

        stage.scale({ x: limitedScale, y: limitedScale });

        const newPos = {
          x: pointer.x - mousePointTo.x * limitedScale,
          y: pointer.y - mousePointTo.y * limitedScale,
        };

        stage.position(newPos);
        setViewPort({
          x: newPos.x,
          y: newPos.y,
          zoom: limitedScale,
        });
      }
    }
  };
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (stage) {
      setIsDragging(true);
      const pointer = stage.getPointerPosition();
      if (pointer) {
        lastMousePos.current = pointer;
      }
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDragging) return;
    const stage = stageRef.current;
    if (stage) {
      const pointer = stage.getPointerPosition();
      if (pointer) {
        const dx = pointer.x - lastMousePos.current.x;
        const dy = pointer.y - lastMousePos.current.y;
        stage.x(stage.x() + dx);
        stage.y(stage.y() + dy);
        lastMousePos.current = pointer;
        setViewPort({
          x: stage.x(),
          y: stage.y(),
          zoom: viewPort.zoom,
        });
      }
    }
  };
  useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      const container = stage.container();
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (stage) {
        stage.container().removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      ref={stageRef}
      draggable={false}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {scene.layers.map((layer) => (
        <Layer
          key={layer.id}
          id={layer.id}
          ref={layerRef}
          visible={!layer.locked}
          opacity={layer.opacity}
        >
          {layer.shapes.map((shapeId) => {
            const shape = scene.shapes.find((s) => s.id === shapeId);
            if (shape) {
              return renderShape(shape);
            }
            return null;
          })}
        </Layer>
      ))}
      <Layer>{scene.vehicles.map((vehicle) => renderVehicle(vehicle))}</Layer>
      <Layer>
        {scene.sceneObjects.map((sceneObject) =>
          renderSceneObject(sceneObject)
        )}
      </Layer>
    </Stage>
  );
};

export default CanvasRenderer;
