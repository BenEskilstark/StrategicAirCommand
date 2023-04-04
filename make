#!/bin/bash

# npm run babel -- --plugins transform-react-jsx

mkdir bin

npm run babel -- js/ -d bin

# clientside require everything into a single bundle.js file
npm run browserify -- bin/index.js -o bin/bundle.js -p esmify

# remove everything but the bundle
mv bin/bundle.js ./
rm -rf bin/
mkdir bin

# put the bundle back
mv bundle.js bin/





