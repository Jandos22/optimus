<!doctype html>
<html lang="en">

<!--
  Zhandos Ombayev, Founder & CEO
  - zombayev@slb.com, ombayev@gmail.com
  - +7 771 177 83 33 (cell phone)
  - +7 705 773 73 66 (whatsapp, telegram)
-->

<head>

  <title>Optimus</title>

  <!-- base href is dynamically assigned according to development environment
       with angular-cli, check package.json -->
  <base href="/">

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- material icons are self-hosted and import via css in angular.json -->
  <!-- roboto font is self-hosted and imported via styles.css -->
  <!-- material design theme is customized via styles__theme.scss -->

  <!-- MOBILE -->
  <!-- don't use apple-mobile meta tag, it always reloads app on visibility change -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Optimus">

  <!-- browser, pc desktop and android icon -->
  <link rel="icon" type="image/x-icon" href="assets/icons/favicon8_32p.png">
  <!-- <link rel="icon" type="image/x-icon" href="assets/icons/favicon8x10_32p.png"> -->

  <!-- iOS homescreen icon -->
  <link rel="apple-touch-icon" href="assets/icons/favicon8_iphone.png">

  <!-- Manifest
    experiment with manifest didn't succeed, need to investigate this topic more
  -->
  <!-- <link rel="manifest" href="assets/manifest.json"> -->

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