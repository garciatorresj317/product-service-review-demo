const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryBasePath = '/product-service-review-demo';

/** @type {import('next').NextConfig} */
const nextConfig = isGitHubPages
  ? {
      output: 'export',
      basePath: repositoryBasePath,
      assetPrefix: repositoryBasePath,
      trailingSlash: true,
    }
  : {};

export default nextConfig;