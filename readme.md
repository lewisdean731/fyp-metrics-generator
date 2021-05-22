# project-scanner

Scans projects in firestore and updates time-series metrics for them

## Install
```bash
npm install
```

## Run Locally

```bash
npm run compile
```

```bash
API_ENDPOINT="http://localhost:8080/api" \
API_KEY="addAPIkeyHere" \
RUN_DELAY_SECONDS="30" \
node dist/index.js
```