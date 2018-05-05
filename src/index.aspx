<!doctype html>
<html lang="en">

<!--
  Zhandos Ombayev, Founder & CEO :)
  - zombayev@slb.com, ombayev@gmail.com
  - +7 705 773 73 66 (KZ)
-->


<head>

  <title>Optimus</title>

  <base href="/sites/wireline/optimus/index.aspx">
  <!-- <base href="/sites/wireline/x10/index.aspx"> -->
  <!-- <base href="/"> -->

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Material Icons need to be tested in Wimax Network, they might not work there -->
  <!-- <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> -->

  <!--
    this meta tags added for mobile FULLSCREEN experience
    - user needs to add web app to Home Screen
    - on iOS Safari, web app always gets reloaded when visibility changes
    - everything else works just great, feels like native app
    - think about design of Server State Store for every user
  -->
  <!-- this metatag doesn't let camera to shoot on iOS devices in Safari and Chrome -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Optimus">

  <link rel="icon" type="image/x-icon" href="assets/icons/favicon8_32p.png">

  <!-- iOS homescreen web app, need to prepare best looking icons -->
  <!-- tested, it works -->
  <link rel="apple-touch-icon" href="assets/icons/favicon8_iphone.png">

  <!-- Manifest
    experiment with manifest didn't succeed, need to investigate this topic more
  -->
  <link rel="manifest" href="assets/manifest.json">

</head>

<body>
  <app-root>
    <div class="loading">
      <img src="assets/logo.png" alt="Loading Optimus" class="loadingOptimus">
    </div>
  </app-root>
</body>

<!-- iOS Safari fullscreen issue
  experiments with visibility change and use of hash didn't succeed
  - best option is to use Google Chrome on iOS which doesn't hide address bar, but gives best UX with my web app.
-->

</html>