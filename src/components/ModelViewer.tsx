import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh, Object3D, Box3, Sphere, Vector3, PerspectiveCamera } from 'three';
import { OrbitControls } from '@react-three/drei';

// Define the NameColorPair interface
interface NameColorPair {
  name: string;
  color: string;
}

// Define the props interface for MyModel
interface MyModelProps {
  objectsToPaint: NameColorPair[];
  objToDisplay: string;
}

// Define the props interface for ModelViewer
interface ModelViewerProps {
  objectsToPaint: NameColorPair[];
  objToDisplay: string;
}

const MyModel: React.FC<MyModelProps> = ({ objectsToPaint, objToDisplay }) => {
  const { scene: loadedScene } = useGLTF(objToDisplay);
  const modelRef = useRef<Object3D>(null!);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { scene: mainScene, gl, camera } = useThree();

  // Set the scene background to transparent
  useEffect(() => {
    mainScene.background = null;
    gl.setClearColor(0x000000, 0); // Fully transparent
  }, [mainScene, gl]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Traverse the scene to modify specific objects
  loadedScene.traverse((child) => {
    if (child instanceof Mesh) {
      const colorPair = objectsToPaint.find((pair) => pair.name === child.name);
      let colorToUse: string | undefined;
      if (colorPair) {
        colorToUse = colorPair.color;
      } else {
        const allMeshPair = objectsToPaint.find((pair) => pair.name === 'ALLMESH');
        if (allMeshPair) {
          colorToUse = allMeshPair.color;
        }
      }
      if (colorToUse) {
        const newMaterial = child.material.clone();
        newMaterial.color.set(colorToUse);
        child.material = newMaterial;
      }
    }
  });

  // Adjust camera position based on model size
  useEffect(() => {
    const box = new Box3().setFromObject(loadedScene);
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);
    const radius = sphere.radius;
    const center = sphere.center;
    const fov = (camera as PerspectiveCamera).fov * (Math.PI / 180); // Convert FOV to radians
    const distance = (radius / Math.tan(fov / 2)) * 1.1; // Add 10% margin
    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);
  }, [loadedScene, camera]);

  // Smoothly rotate the model based on mouse position
  useFrame(() => {
    if (modelRef.current) {
      const sensitivity = 0.5;
      const adjustedMouseX = Math.sign(mouse.x) * Math.pow(Math.abs(mouse.x), sensitivity);
      const adjustedMouseY = Math.sign(mouse.y) * Math.pow(Math.abs(mouse.y), sensitivity);

      const targetRotationY = adjustedMouseX * (Math.PI / 6) - Math.PI / 4;
      const targetRotationX = adjustedMouseY * (Math.PI / 6);

      modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.1;
      modelRef.current.rotation.x += (targetRotationX - modelRef.current.rotation.x) * 0.1;
    }
  });

  return <primitive ref={modelRef} object={loadedScene} />;
};

// ModelViewer component: sets up the canvas and renders the model
const ModelViewer: React.FC<ModelViewerProps> = ({ objectsToPaint, objToDisplay }) => {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 500], fov: 45 }}
      gl={{ alpha: true }}
      style={{ backgroundColor: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <MyModel objectsToPaint={objectsToPaint} objToDisplay={objToDisplay} />
    </Canvas>
  );
};

export default ModelViewer;