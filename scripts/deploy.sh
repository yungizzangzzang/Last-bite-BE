REPOSITORY=/home/ubuntu/yungizzang
NODE_APP_DIR=$REPOSITORY
BACKEND_ENV_PATH=$NODE_APP_DIR/.env.production

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use v20.8.0

cd $REPOSITORY

pm2 delete 'NestJS App'

if [ -f $BACKEND_ENV_PATH ]; then
    source $BACKEND_ENV_PATH
else
    echo "> .env.production 파일이 존재하지 않습니다."
fi

echo "> Installing backend dependencies"
cd $NODE_APP_DIR
npm install

echo "> Starting Node app"
cd $NODE_APP_DIR
npm run start:prod
