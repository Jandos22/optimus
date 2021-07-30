// credentials used in development mode
// by "sp-rest-proxy"
// enter in "private.json" files

// this is needed to simulate that REST requests are started from SharePoint site
// not localhost to overcome CORS authorization issues

const Optimus2 = {
  clientId: '773d1dc5-879d-4fc0-8a16-9fc0b4eb8347',
  clientSecret: 'dcV1XxqFy6LAwcEfMuLSc5W8IkEm9F2g5xT4/yl2vSI='
};

// you need 2 command terminals
// because "serve" and "start" shall run at the same time

// then run "npm run serve" to start proxy server
// it will start proxy on http://localhost:8080

// then run "npm run start" to start developer server
// it will run development server on http://localhost:4200
