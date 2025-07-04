// src/components/ModelViewer.tsx

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh, Object3D, Box3, Sphere, PerspectiveCamera, Raycaster, Vector2 } from 'three';

// Define types
interface NameColorPair {
  name: string;
  color: string;
}

type InputType = 'mouse' | 'scroll' | 'touch' | 'none';
type TransformType = 'rotation' | 'scale' | 'position';
type Axis = 'x' | 'y' | 'z';

interface TransformControl {
  property: 'rotation.x' | 'rotation.y' | 'rotation.z' | 'scale.x' | 'scale.y' | 'scale.z' | 'position.x' | 'position.y' | 'position.z';
  inputType: InputType;
  mapping: (inputValue: any) => number;
}

interface MyModelProps {
  objectsToPaint: NameColorPair[];
  objToDisplay: string;
  transformControls: TransformControl[];
  scrollValue?: number;
  clickableObjects?: string[];
  onObjectClick?: (objectName: Object3D) => void;
}

const MyModel: React.FC<MyModelProps> = ({ objectsToPaint, objToDisplay, transformControls, scrollValue, clickableObjects, onObjectClick }) => {
  const { scene: loadedScene } = useGLTF(objToDisplay);
  const modelRef = useRef<Object3D>(null!);
  const clickableMeshes = useRef<Mesh[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [touch, setTouch] = useState({ x: 0, y: 0, isTouching: false });
  const { scene: mainScene, gl, camera } = useThree();

  useEffect(() => {
    mainScene.background = null;
    gl.setClearColor(0x000000, 0);
  }, [mainScene, gl]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    clickableMeshes.current = [];
    loadedScene.traverse((child) => {
      if (child instanceof Mesh) {
        if (!clickableObjects || clickableObjects.length === 0 || clickableObjects.includes(child.name)) {
          clickableMeshes.current.push(child);
        }
      }
    });
  }, [loadedScene, clickableObjects]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new Raycaster();
      const mouseVector = new Vector2(x, y);
      raycaster.setFromCamera(mouseVector, camera);

      const intersects = raycaster.intersectObjects(clickableMeshes.current, true);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        onObjectClick?.(intersectedObject);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [gl, camera, onObjectClick, clickableMeshes]);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      const touchEvent = event.touches[0];
      setTouch({ x: touchEvent.clientX, y: touchEvent.clientY, isTouching: true });
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touchEvent = event.touches[0];
        const normalizedX = (touchEvent.clientX / window.innerWidth) * 2 - 1;
        const normalizedY = -(touchEvent.clientY / window.innerHeight) * 2 + 1;
        setTouch({ x: normalizedX, y: normalizedY, isTouching: true });
      }
    };
    const handleTouchEnd = () => {
      setTouch((prev) => ({ ...prev, isTouching: false }));
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  loadedScene.traverse((child) => {
    if (child instanceof Mesh) {
      const colorPair = objectsToPaint.find((pair) => pair.name === child.name);
      let colorToUse: string | undefined;
      if (colorPair) {
        colorToUse = colorPair.color;
      } else {
        const allMeshPair = objectsToPaint.find((pair) => pair.name === 'ALLMESH');
        if (allMeshPair) colorToUse = allMeshPair.color;
      }
      if (colorToUse) {
        const newMaterial = child.material.clone();
        newMaterial.color.set(colorToUse);
        child.material = newMaterial;
      }
    }
  });

  useEffect(() => {
    loadedScene.traverse((child) => {
      if (child instanceof Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        const isTransparent = materials.some((mat) => mat.transparent);
        child.castShadow = !isTransparent;
      }
    });
  }, [loadedScene]);

  useEffect(() => {
    const box = new Box3().setFromObject(loadedScene);
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);
    const radius = sphere.radius;
    const center = sphere.center;
    const fov = (camera as PerspectiveCamera).fov * (Math.PI / 180);
    const distance = (radius / Math.tan(fov / 2)) * 1.1;
    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);
  }, [loadedScene, camera]);

  useFrame(() => {
    if (modelRef.current) {
      transformControls.forEach((control) => {
        let inputValue;
        if (control.inputType === 'mouse') {
          inputValue = mouse;
        } else if (control.inputType === 'scroll') {
          inputValue = scrollValue;
        } else if (control.inputType === 'touch' && touch.isTouching) {
          inputValue = touch;
        } else if (control.inputType === 'none') {
          // No input value for 'none'
        }
        if (inputValue !== undefined) {
          const targetValue = control.mapping(inputValue);
          const [transformType, axis] = control.property.split('.') as [TransformType, Axis];
          const transformObject = modelRef.current[transformType];
          if (transformObject) {
            const currentValue = transformObject[axis];
            transformObject[axis] += (targetValue - currentValue) * 0.1;
          }
        }
      });
    }
  });

  return <primitive ref={modelRef} object={loadedScene} />;
};

interface ModelViewerProps {
  objectsToPaint: NameColorPair[];
  objToDisplay: string;
  transformControls?: TransformControl[];
  scrollValue?: number;
  clickableObjects?: string[];
  onObjectClick?: (objectName: Object3D) => void;
  children?: React.ReactNode; // <--- CHANGE 1: ADD THIS LINE
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  objectsToPaint,
  objToDisplay,
  transformControls = [],
  scrollValue,
  clickableObjects,
  onObjectClick,
  children, // <--- CHANGE 2: DESTRUCTURE children from props
}) => {
  return (
    <Canvas
      shadows
      className="w-full h-full"
      camera={{ position: [0, 0, 500], fov: 45 }}
      gl={{ alpha: true }}
      style={{ backgroundColor: 'transparent' }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[5, 5, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
      <MyModel
        objectsToPaint={objectsToPaint}
        objToDisplay={objToDisplay}
        transformControls={transformControls}
        scrollValue={scrollValue}
        clickableObjects={clickableObjects}
        onObjectClick={onObjectClick}
      />
      {/* CHANGE 3: Render the children here. This places them inside the <Canvas>
          where they are valid components. */}
      {children}
    </Canvas>
  );
};

export default ModelViewer;