import React, { useState, useRef } from 'react';
import { Canvas, useThree, extend, useFrame } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { a, useSpring } from 'react-spring/three';


extend({ OrbitControls });

function Cube(props) {
  const [isBig, setIsBig] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef();

  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  const { size, x } = useSpring({
    size: isBig ? [2, 2, 2] : [1, 1, 1],
    x: isBig ? 1 : 0
  });

  const color = isHovered ? "pink" : "salmon";

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
      <sphereBufferGeometry attach="geometry" args={[1, 8, 6]} />      
      <meshPhongMaterial
        flatShading={true} 
        roughness={1} 
        metalness={0.5}
        shininess ={100}
        attach="material" 
        color={color} 
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
      <planeBufferGeometry attach="geometry" args={[15, 15]} />
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
      <Cube rotation={[10, 10, 0]} position={[0, 0, 0]}/>
      <Cube rotation={[10, 20, 0]} position={[2, 2, 0]}/>
      <Plane />
      <orbitControls args={[camera, domElement]} />
    </>
  );
};

function Drei() {
  return (
    <Canvas shadowMap={true}>
      <Scene />
    </Canvas>
  );
};

export default Drei;
