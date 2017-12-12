#!/bin/bash
ng build --prod
cp -r ./dist/* ../musiclynx.github.io/
cd ../musiclynx.github.io/
git add .
git add assets/.
git commit -am "automatic deployment on `date +'%Y-%m-%d %H:%M:%S'`"
git push https://musiclynx@github.com/musiclynx/musiclynx.github.io.git master:master
