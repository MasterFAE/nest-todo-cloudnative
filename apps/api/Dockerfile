FROM node:alpine AS development
ARG PORT=3000
EXPOSE ${PORT} 50051

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json nest-cli.json
COPY apps/api apps/api
COPY libs libs
COPY proto proto

RUN npm install

# RUN npm run build api
# CMD [ "npm", "run", "start:dev", "api" ]

FROM node:alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
EXPOSE ${PORT} 50051

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/api/src/main"]