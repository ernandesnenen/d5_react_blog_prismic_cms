import { Document } from '@prismicio/client/types/documents';

// -- Prismic Repo Name
export const repoName = process.env.PRISMIC_API_ENDPOINT;

// -- Prismic API endpoint
// Determines which repository to query and fetch data from
// Configure your site's access point here
export const apiEndpoint = `${repoName}`;

// -- Access Token if the repository is not public
// Generate a token in your dashboard and configure it here if your repository is private
export const accessToken = process.env.PRISMIC_TOKEN;

// -- Link resolution rules
// Manages the url links to internal Prismic documents
export const linkResolver = (doc: Document): string => {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`;
  }
  return '/';
};

// -- Route Resolver rules
// Manages the url links to internal Prismic documents two levels deep (optionals)
export const Router = {
  routes: [
    {
      type: 'posts',
      path: '/post/:uid',
    },
  ],
};
