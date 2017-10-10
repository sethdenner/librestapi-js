#!/bin/bash

echo ${1} > ~/.npmrc

(
    # Make sure the current working directory is the same one this file is in.
    RUN_ROOT=$(readlink -f ${0%/*})/../..
    # Default to dev environment
    cd $RUN_ROOT

    git config --global user.email "seth@knotis.com"
    git config --global user.name "Jenkins Bot"
    git config --global push.default matching

    rm -rf ./node_modules
    npm install

    VERSION=$(npm version patch)
    git push
    git tag -a ${VERSION} -m "Published Version: ${VERSION}"

    npm publish

)
