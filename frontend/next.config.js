/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['pubchem.ncbi.nlm.nih.gov', 'firebasestorage.googleapis.com'],
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
