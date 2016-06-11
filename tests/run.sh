#!/bin/bash

(
    serverPID=$(npm run start-fakeapi -s)
    npm run build-dev && intern-client config=tests/intern || true
    kill $serverPID
)
