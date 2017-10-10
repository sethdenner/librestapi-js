#!/bin/bash

(
    npm run build-dev && intern-client config=tests/intern
)
