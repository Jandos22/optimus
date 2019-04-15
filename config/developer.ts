// credentials used in development mode
// by "sp-rest-proxy"
// enter in "private.json" files

// this is needed to simulate that REST requests are started from SharePoint site
// not localhost to overcome CORS authorization issues

const OptimusCredentials = {
  clientId: '4670930a-87ea-48f5-a507-4f1e3a29d054',
  clientSecret: 'G7XOJ+5cucfFnSQ3n6OfMp68U+vbNuYQYir4vKyix8I='
};

// you need 2 command terminals
// because "serve" and "start" shall run at the same time

// then run "npm run serve" to start proxy server
// it will start proxy on http://localhost:8080

// then run "npm run start" to start developer server
// it will run development server on http://localhost:4200
