import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend, useLoader } from 'react-three-fiber';
import { TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { a, useSpring } from 'react-spring/three';

import imageUrl from './coming-soon.png';

extend({ OrbitControls });

function Cube(props) {
  const [isBig, setIsBig] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef();

  // DON'T use useState with useFrame due to the 60f/s speed of Rotation!!!
  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  const { size, x } = useSpring({
    size: isBig ? [2, 2, 2] : [1, 1, 1],
    x: isBig ? 1 : 0
  });

  const texture = useLoader(TextureLoader, imageUrl);
  const textureX = useLoader(TextureLoader, 'http://jaanga.github.io/moon/heightmaps/WAC_GLD100_E000N1800_004P-1024x512.png');
  const useTexture = isHovered ? textureX : texture;

  return (
    <a.mesh 
      {...props}
      ref={ref}
      scale={size}
      position-x={x}
      castShadow={true}
      receiveShadow={true}
      onClick={() => setIsBig(!isBig)}
      onPointerOut={() => setIsHovered(false)}
      onPointerOver={() => setIsHovered(true)}
    >
      {/* Primitives */}
      {/* <sphereBufferGeometry attach="geometry" args={[1, 8, 6]} /> */}
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} /> {/* box args = [Width, Height, Depth]  */}
      
      {/* Materials */}
      <meshPhongMaterial
        map={useTexture}
        flatShading={true} 
        roughness={1} 
        metalness={0.5}
        shininess ={100}
        attach="material" 
      />
    </a.mesh>
  );
};

function Plane() {
  return (
    <mesh 
      receiveShadow={true}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, -5]}
    >
      <planeBufferGeometry attach="geometry" args={[20, 20]} />
      <meshPhongMaterial attach="material" color="#D3D3D3" />
    </mesh>
  )
}

function Scene() {
  const { 
    camera,
    gl: { domElement }
  } = useThree();

  return (
    <>
      <ambientLight />
      <spotLight castShadow={true} intensity={0.6} position={[0, 10, 4]} />
      <Suspense fallback={null}>
        <Cube rotation={[10, 10, 0]} position={[0, 0, 0]}/>
      </Suspense>
      <Suspense fallback={null}>
        <Cube rotation={[10, 20, 0]} position={[2, 2, 0]}/>
      </Suspense>
      <Plane />
      <orbitControls args={[camera, domElement]} />
    </>
  );
};

function App() {
  return (
    <Canvas shadowMap={true}>
      <Scene />
    </Canvas>
  );
};

export default App;
