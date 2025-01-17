import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls, Torus } from 'drei';
import { a, useSpring } from 'react-spring/three';
import { Controls, useControl } from 'react-three-gui';


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
  const positionX = useControl(
    'Position X', 
    { type: 'number', max: 10, min: -10 }
  );

  const color = useControl(
    'Torus Color', 
    { type: 'color', value: 'gold' }
  )

  return (
    <>
      <ambientLight />
      <spotLight castShadow={true} intensity={0.6} position={[0, 10, 4]} />
      <Cube rotation={[10, 10, 0]} position={[positionX, 0, 0]}/>
      <Cube rotation={[10, 20, 0]} position={[2, 2, 0]}/>
      <Torus args={[1, 0.4, 10, 30]} position={[-3, 1, -1]}>
        <meshPhongMaterial
          roughness={1} 
          metalness={0.5}
          shininess ={100}
          attach="material" 
          color={color} 
        />
      </Torus>
      <Plane />
      <OrbitControls />
    </>
  );
};

function Drei() {
  return (
    <>
      <Canvas shadowMap={true}>
        <Scene />
      </Canvas>
      <Controls />
    </>
  );
};

export default Drei;
    