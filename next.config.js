/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    // Configuration pour les fichiers 3D (.glb, .gltf, etc.)
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });
    
    // Configuration pour les fichiers image utilisés par Three.js
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      type: 'asset/resource',
    });

    return config;
  },
}

module.exports = nextConfig 