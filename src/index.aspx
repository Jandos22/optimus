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

  <!-- ***** S-T-Y-L-I-N-G ***** -->
  <!-- roboto font is self-hosted and imported via styles.scss -->
  <!-- material design theme is customized via styles__theme.scss -->

  <!-- ***** M-O-B-I-L-E ***** -->
  <!-- don't use apple-mobile meta tag, it always reloads app on visibility change, bad -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Optimus">

  <!-- PC and Android icon -->
  <link rel="icon" type="image/x-icon" href="assets/icons/favicon8_32p.png">

  <!-- iOS homescreen icon -->
  <link rel="apple-touch-icon" href="assets/icons/favicon8_iphone.png">

  <!-- Manifest
    experiment with manifest didn't succeed, need to investigate this topic more
  -->
  <!-- <link rel="manifest" href="assets/manifest.json"> -->

</head>

<!-- style applied inline on purpose -->
<!-- because depending on user's internet -->
<!-- styles file will load with delay -->

<body style="background-color: #bbdefb; height: 100vh;">
  <app-root style="margin: 0;">
    <div style="position: relative; background-color: #bbdefb; height: 100vh; margin: 0;">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <span style="margin: auto auto">
          Optimization Suite
        </span>
      </div>
      <div style="display: flex; align-items: center; position: absolute; bottom: 0; margin: auto auto; width: 100%; height: 64px; color: rgba(0,0,0,0.75);">
        <div style="margin: auto;">
          <span>Schlumberger</span>
          <span style="padding: 0 4px">&middot;</span>
          <span>Wireline</span>
        </div>
      </div>
    </div>
  </app-root>
</body>

<!-- iOS Safari fullscreen issue
  experiments with visibility change and use of hash didn't succeed
-->

</html>