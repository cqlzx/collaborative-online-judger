#! /bin/bash

fuser -k 3000/tcp
fuser -k 5000/tcp
service redis_6379 start

cd ./coj-server
npm install
nodemon ./server.js &

cd ../coj-client/
npm install
ng build --watch &

cd ../executor
pip install -r dependencies.txt
python ./executor_server.py &

echo "==============================="
read -p "Press [ENTER] key to stop the services" PRESSKEY

fuser -k 3000/tcp
fuser -k 5000/tcp
service redis_6379 stop