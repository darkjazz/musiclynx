##!/bin/bash
NODE_OPTIONS=--openssl-legacy-provider npx ng build --prod
cp -r ./dist/* ../musiclynx.github.io/
cd ../musiclynx.github.io/
git add .
git add assets/.
git commit -am "automatic deployment on `date +'%Y-%m-%d %H:%M:%S'`"
GIT_SSH_COMMAND="ssh -i /home/alo/.ssh/musiclynx_id_ed25519" git push origin master
