// credentials used in development mode
// by "sp-rest-proxy"
// enter in "private.json" files

// this is needed to simulate that REST requests are started from SharePoint site
// not localhost to overcome CORS authorization issues

const OptimusCredentials = {
  clientId: '597a1503-397d-437d-b4ba-fe9066a4ecb5',
  clientSecret: 'xKTS6lWItXq9SXo1Ur1CvkH/4Rca7qjhvbhiTnpKEIE='
};

// you need 2 command terminals
// because "serve" and "start" shall run at the same time

// then run "npm run serve" to start proxy server
// it will start proxy on http://localhost:8080

// then run "npm run start" to start developer server
// it will run development server on http://localhost:4200
