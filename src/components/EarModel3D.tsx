import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei';
import { Box, CircularProgress, Chip, ToggleButton, ToggleButtonGroup, Typography, Paper, Alert, Button, Link } from '@mui/material';
import { Group } from 'three';

// Parts of the ear that can be highlighted
const earParts = [
  { id: 'all', name: 'Full Ear', color: '#ffffff' },
  { id: 'helix', name: 'Helix', color: '#ff6b6b' },
  { id: 'antihelix', name: 'Antihelix', color: '#4ecdc4' },
  { id: 'tragus', name: 'Tragus', color: '#ffbe0b' },
  { id: 'antitragus', name: 'Antitragus', color: '#fb5607' },
  { id: 'concha', name: 'Concha', color: '#8338ec' },
  { id: 'lobule', name: 'Lobule', color: '#3a86ff' }
];

// Helper function to get the correct asset path
const getAssetPath = (assetPath: string) => {
  // Read the homepage from package.json's PUBLIC_URL
  const publicUrl = process.env.PUBLIC_URL || '';
  
  // If the path already starts with the public URL, return it as is
  if (assetPath.startsWith(publicUrl)) {
    return assetPath;
  }
  
  // Otherwise, join the public URL with the asset path
  return `${publicUrl}${assetPath.startsWith('/') ? '' : '/'}${assetPath}`;
};

// Model component for the ear with error handling
function EarModel({ 
  modelPath, 
  activePart = 'all',
  onPartHover,
  onError 
}: { 
  modelPath: string;
  activePart?: string;
  onPartHover?: (part: string | null) => void;
  onError?: (error: any) => void;
}) {
  console.log(`Attempting to load 3D model from: ${modelPath}`);
  
  // Hooks must be at the top level, not inside conditionals
  const modelRef = useRef<Group>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<any>(null);
  
  // Move useGLTF hook call to the top level
  // React-three-fiber will handle errors internally
  const { scene: model, ...gltfResult } = useGLTF(modelPath);
  
  // Use a separate useEffect for error handling since useGLTF doesn't accept an error callback
  useEffect(() => {
    try {
      if (model) {
        console.log(`Successfully loaded 3D model:`, { scene: model, ...gltfResult });
      }
    } catch (error: unknown) {
      console.error('Error loading model:', error);
      setLoadError(error);
      if (onError) onError(error);
    }
  }, [model, gltfResult, onError]);
  
  // Automatic rotation when not interacting
  useFrame((state, delta) => {
    if (modelRef.current && isRotating) {
      modelRef.current.rotation.y += delta * 0.2;
    }
  });

  // Highlight the active part (this would need to be adapted based on the actual model structure)
  useEffect(() => {
    if (!modelRef.current) return;
    
    // This is a placeholder for actual model part highlighting
    // In a real implementation, you would identify parts of the model by name/id and change their material
    
    // Reset all materials to default
    modelRef.current.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.emissive.set(0x000000);
        child.material.emissiveIntensity = 0;
      }
    });
    
    // Highlight the selected part
    if (activePart !== 'all') {
      modelRef.current.traverse((child: any) => {
        // This assumes parts have names that include the activePart string
        // Modify this logic based on your actual model structure
        if (child.isMesh && child.name.toLowerCase().includes(activePart.toLowerCase())) {
          const partInfo = earParts.find(p => p.id === activePart);
          if (partInfo) {
            child.material.emissive.set(partInfo.color);
            child.material.emissiveIntensity = 0.5;
          }
        }
      });
    }
  }, [activePart]);

  // If there was an error loading the model, render error message
  if (loadError) {
    return (
      <Html center>
        <div style={{ color: 'red', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '5px' }}>
          Error loading 3D model
        </div>
      </Html>
    );
  }
  
  // If model loaded successfully, render it
  return (
    <group 
      ref={modelRef} 
      scale={0.15} 
      position={[0, 0, 0]}
      onPointerOver={() => setIsRotating(false)}
      onPointerOut={() => setIsRotating(true)}
    >
      <primitive 
        object={model} 
        dispose={null} 
      />
      
      {/* HTML annotation labels would go here in a real implementation */}
      {/* This is just placeholder code since we don't know the exact structure of the 3D model */}
      {activePart !== 'all' && (
        <Html position={[0, 0, 0]} distanceFactor={10}>
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            color: 'white', 
            padding: '5px 10px', 
            borderRadius: '4px',
            transform: 'translate3d(-50%, -50%, 0)'
          }}>
            {earParts.find(p => p.id === activePart)?.name}
          </div>
        </Html>
      )}
    </group>
  );
}

// Main 3D ear model component
const EarModel3D: React.FC<{ height?: string | number }> = ({ height = 400 }) => {
  const [loading, setLoading] = useState(true);
  const [activePart, setActivePart] = useState('all');
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [modelError, setModelError] = useState<any>(null);
  
  const handlePartChange = (
    event: React.MouseEvent<HTMLElement>,
    newPart: string,
  ) => {
    if (newPart !== null) {
      setActivePart(newPart);
    }
  };

  const handleModelError = (error: any) => {
    setModelError(error);
    setLoading(false);
  };
  
  // Function to verify the model file exists
  const verifyModelExists = async () => {
    const modelPath = getAssetPath('/assets/Main_ear_default.glb');
    try {
      const response = await fetch(modelPath, { method: 'HEAD' });
      if (response.ok) {
        alert(`Success! Model file found at ${modelPath}\nContent-Type: ${response.headers.get('Content-Type')}\nContent-Length: ${response.headers.get('Content-Length')} bytes`);
      } else {
        alert(`Error: Could not find model at ${modelPath}\nStatus: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      alert(`Error checking model file: ${err}`);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto', 
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >

      {/* 3D viewer */}
      <Box
        sx={{
          width: '100%',
          height,
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
        }}
      >
        {loading && !modelError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        {modelError ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2
            }}
          >
            <Alert severity="error" sx={{ width: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold">Could not load 3D ear model</Typography>
              <Typography variant="body2">
                Please check that the file exists at {getAssetPath('/assets/Main_ear_default.glb')}
              </Typography>
              <Typography variant="caption" component="pre" sx={{ 
                mt: 1, 
                p: 1, 
                bgcolor: 'rgba(0,0,0,0.05)', 
                borderRadius: 1,
                overflow: 'auto',
                maxWidth: '100%'
              }}>
                {modelError.toString()}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button size="small" variant="outlined" color="primary" onClick={verifyModelExists}>
                  Check if model file exists
                </Button>
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="secondary" 
                  component={Link}
                  href={getAssetPath('/assets/Main_ear_default.glb')} 
                  target="_blank"
                >
                  Open model file directly
                </Button>
              </Box>
            </Alert>
          </Box>
        ) : (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            onCreated={() => setLoading(false)}
            fallback={
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 2, 
                textAlign: 'center' 
              }}>
                <Typography>
                  Your browser may not fully support 3D content. 
                  <br />
                  Please try using a modern browser like Chrome, Firefox or Edge.
                </Typography>
              </Box>
            }
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.7} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <EarModel 
                modelPath={getAssetPath('/assets/Main_ear_default.glb')} 
                activePart={activePart}
                onPartHover={setHoveredPart}
                onError={handleModelError}
              />
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={10}
                autoRotate={false}
              />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        )}
      </Box>
      
      {!modelError && (
        <Typography variant="caption" color="text.secondary" align="center">
          Use mouse to rotate the model. Scroll to zoom in/out.
        </Typography>
      )}
    </Box>
  );
};

export default EarModel3D; 