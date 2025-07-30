/* eslint-disable react/no-unknown-property */
"use client";
import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

// Assets via public URLs
const cardGLB = "/models/card.glb";
const lanyard = "/models/lanyard.png";

extend({ MeshLineGeometry, MeshLineMaterial });

// Déclaration de types pour les composants mesh line
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  isVerySmall?: boolean;
}

export default function Lanyard({
  position = [0, 0, 200],
  gravity = [0, 100, 0],
  fov = 10,
  transparent = true,
  isVerySmall = false,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  // Paramètres adaptés pour mobile et très petits écrans
  const mobilePosition: [number, number, number] = isVerySmall ? [0, 0, 100] : [0, 0, 120];
  const mobileGravity: [number, number, number] = isVerySmall ? [-0, -45, 0] : [0, -40, 0];
  const mobileFov = isVerySmall ? 5 : 4;

  return (
    <div className="relative z-0 w-full h-full flex justify-center items-center transform scale-100 origin-center mobile-optimized">
      <Canvas
        camera={{ 
          position: isMobile ? mobilePosition : position, 
          fov: isMobile ? mobileFov : fov 
        }}
        gl={{ 
          alpha: transparent,
          antialias: !isMobile, // Désactiver l'antialiasing sur mobile pour les performances
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          if (isMobile) {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          }
        }}
        dpr={isMobile ? [1, 2] : [1, 3]}
      >
        <ambientLight intensity={Math.PI} />
        <Physics 
          gravity={isMobile ? mobileGravity : gravity} 
          timeStep={1 / 60}
          paused={false}
        >
          <Suspense fallback={<group />}>
            <BandWrapper isMobile={isMobile} isVerySmall={isVerySmall} />
          </Suspense>
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={isMobile ? 1.5 : 2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={isMobile ? 2 : 3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={isMobile ? 2 : 3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={isMobile ? 7 : 10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

// Wrapper pour gérer le chargement du modèle
function BandWrapper({ isMobile, isVerySmall }: { isMobile: boolean; isVerySmall: boolean }) {
  return <Band isMobile={isMobile} isVerySmall={isVerySmall} />;
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  isVerySmall?: boolean;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, isVerySmall = false }: BandProps) {
  // Using "any" for refs since the exact types depend on Rapier's internals
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: "dynamic" as RigidBodyProps["type"],
    canSleep: true,
    colliders: false,
    angularDamping: isMobile ? 6 : 4,
    linearDamping: isMobile ? 6 : 4,
  };

  // Chargement du modèle GLB avec gestion d'erreur
  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyard);
  
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  
  const [dragged, setDragged] = useState<false | THREE.Vector3>(false);
  const [hovered, setHovered] = useState(false);

  const [isSmall, setIsSmall] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  // Joints Rapier
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, isMobile ? 2.43 : 3.65, 0],
  ]);

  useEffect(() => {
    if (hovered && !isMobile) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged, isMobile]);

  // Handlers sécurisés pour les événements
  const handlePointerDown = useCallback((e: any) => {
    if (!card.current) return;
    try {
      e.target.setPointerCapture(e.pointerId);
      setDragged(
        new THREE.Vector3()
          .copy(e.point)
          .sub(vec.copy(card.current.translation()))
      );
    } catch (error) {
      console.error("Erreur dans handlePointerDown:", error);
    }
  }, [vec]);

  const handlePointerUp = useCallback((e: any) => {
    try {
      e.target.releasePointerCapture(e.pointerId);
      setDragged(false);
    } catch (error) {
      console.error("Erreur dans handlePointerUp:", error);
    }
  }, []);

  const handlePointerOver = useCallback(() => {
    if (!isMobile) setHovered(true);
  }, [isMobile]);

  const handlePointerOut = useCallback(() => {
    if (!isMobile) setHovered(false);
  }, [isMobile]);

  useFrame((state, delta) => {
    try {
      if (dragged && typeof dragged !== "boolean" && card.current) {
        vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
        dir.copy(vec).sub(state.camera.position).normalize();
        vec.add(dir.multiplyScalar(state.camera.position.length()));
        
        // Vérifier que toutes les références existent avant de les réveiller
        [card, j1, j2, j3, fixed].forEach((ref) => {
          if (ref.current?.wakeUp) {
            ref.current.wakeUp();
          }
        });
        
        if (card.current?.setNextKinematicTranslation) {
          card.current.setNextKinematicTranslation({
            x: vec.x - dragged.x,
            y: vec.y - dragged.y,
            z: vec.z - dragged.z,
          });
        }
      }
      
      if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
        const speedMultiplier = isMobile ? 0.8 : 1;
        
        [j1, j2].forEach((ref) => {
          if (ref.current?.translation) {
            if (!ref.current.lerped) {
              ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
            }
            const clampedDistance = Math.max(
              0.1,
              Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
            );
            ref.current.lerped.lerp(
              ref.current.translation(),
              delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)) * speedMultiplier
            );
          }
        });
        
        if (j3.current?.translation && j2.current?.lerped && j1.current?.lerped && fixed.current?.translation) {
          curve.points[0].copy(j3.current.translation());
          curve.points[1].copy(j2.current.lerped);
          curve.points[2].copy(j1.current.lerped);
          curve.points[3].copy(fixed.current.translation());
          
          if (band.current?.geometry?.setPoints) {
            band.current.geometry.setPoints(curve.getPoints(isMobile ? 24 : 32));
          }
        }
        
        if (card.current?.angvel && card.current?.rotation && card.current?.setAngvel) {
          ang.copy(card.current.angvel());
          rot.copy(card.current.rotation());
          card.current.setAngvel({ 
            x: ang.x, 
            y: ang.y - rot.y * (isMobile ? 0.15 : 0.25), 
            z: ang.z 
          });
        }
      }
    } catch (error) {
      console.error("Erreur dans useFrame:", error);
    }
  });

  // Vérifier que les nodes et materials existent
  if (!nodes || !materials) {
    console.warn("Modèle GLB non chargé correctement - nodes ou materials manquants");
    return <group />;
  }

  // Vérifier qu'au moins le node principal existe
  if (!nodes.card) {
    console.warn("Node 'card' manquant dans le modèle GLB");
    console.log("Nodes disponibles:", Object.keys(nodes));
    return <group />;
  }

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 6, 0]}>
        <RigidBody
          ref={fixed}
          {...segmentProps}
          type={"fixed" as RigidBodyProps["type"]}
        />
        <RigidBody
          position={[0.5, 0, 0]}
          ref={j1}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, 0, 0]}
          ref={j2}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, 0, 0]}
          ref={j3}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={
            dragged
              ? ("kinematicPosition" as RigidBodyProps["type"])
              : ("dynamic" as RigidBodyProps["type"])
          }
        >
          <CuboidCollider args={[1.4, 2, 0.01]} />
          <group
            scale={isVerySmall ? 2.2 : isMobile ? 3 : 4}
            position={[0, -1.2, -0.05]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerUp={handlePointerUp}
            onPointerDown={handlePointerDown}
          >
            {nodes.card && (
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={materials['base card']?.map}
                  map-anisotropy={16}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.9}
                  metalness={0.8}
                />
              </mesh>
            )}
            {nodes.clip && (
              <mesh
                geometry={nodes.clip.geometry}
                material={materials.metal}
                material-roughness={0.3}
              />
            )}
            {nodes.clamp && (
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            )}
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [800, 1600] : isSmall ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={isMobile ? 4 : 10}
        />
      </mesh>
    </>
  );
}
