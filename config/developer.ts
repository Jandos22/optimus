// credentials used in development mode
// by "sp-rest-proxy"
// enter in "private.json" files

// this is needed to simulate that REST requests are started from SharePoint site
// not localhost to overcome CORS authorization issues

const Optimus2 = {
  clientId: '24519c7f-6ca2-4791-ac37-2095348c06c4',
  clientSecret: '8bIo+oyQwtvGE54JjFw901lvR6ZOAfAgJ9YG6ELdupc='
};

// you need 2 command terminals
// because "serve" and "start" shall run at the same time

// then run "npm run serve" to start proxy server
// it will start proxy on http://localhost:8080

// then run "npm run start" to start developer server
// it will run development server on http://localhost:4200
