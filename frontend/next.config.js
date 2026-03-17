/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pubchem.ncbi.nlm.nih.gov' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
  serverExternalPackages: [],
}

module.exports = nextConfig