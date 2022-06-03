## App Center Builder

## Overview
The console App Center branch builder application.
Receiving a list of branches of defined App Center project and building them

[App Center API](https://openapi.appcenter.ms/#/build)
[App Center documentation](https://docs.microsoft.com/en-us/appcenter)

## Sample
Script to run the app:
```
npm run start
```

Expected console output on building completion:
```
< branch name > build < completed/failed > in * seconds. Link to build logs: < link >
```

Update configuration file (src/config/config.json) in order to switch App Center User/App

DEV TODO: logging, exception handling, unit-tests