FROM node:alpine as node
WORKDIR /app/
COPY package.json tsconfig.json ./
COPY src src
COPY views views
RUN npm install
RUN npm run build

RUN apk add curl bind-tools

CMD [ "node", "." ]
