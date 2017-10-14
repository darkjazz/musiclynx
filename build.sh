#!/bin/bash
cd ../musiclynx-ng/
rm -r ./src/app
mkdir ./src/app
mkdir ./src/app/components
mkdir ./src/app/modules
mkdir ./src/app/objects
mkdir ./src/app/services
mkdir -p ./src/assets/featured
cp ../musiclynx-static/app/components/*.ts ./src/app/components/
cp ../musiclynx-static/app/components/*.html ./src/app/components/
cp ../musiclynx-static/app/components/*css ./src/app/components/
cp ../musiclynx-static/app/modules/*.ts ./src/app/modules/
cp ../musiclynx-static/app/objects/*.ts ./src/app/objects/
cp ../musiclynx-static/app/services/*.ts ./src/app/services/
cp ../musiclynx-static/app/services/artist.service.deploy ./src/app/services/artist.service.ts
cp ../musiclynx-static/assets/featured/* ./src/assets/featured/
cp ../musiclynx-static/styles.css ./src/
ng build --prod
