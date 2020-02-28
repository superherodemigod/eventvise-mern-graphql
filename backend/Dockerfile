FROM node:10.12-alpine

RUN apk update && apk add alpine-sdk python g++ pixman cairo-dev jpeg-dev pango-dev giflib-dev
RUN npm config set unsafe-perm true
RUN npm i -g node-pre-gyp
RUN npm --build-from-source install bcrypt

RUN mkdir -p /server
WORKDIR /server

COPY package.json /server/package.json
COPY . /server/
RUN npm install

CMD ["node", "server.js", "-DHTTP_MAX_HEADER_SIZE=800000"]