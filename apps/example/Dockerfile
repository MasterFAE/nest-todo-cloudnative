FROM node:alpine AS development
EXPOSE 50051

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json nest-cli.json
COPY libs libs
COPY apps/example apps/example
COPY prisma ./prisma/


RUN npm install && npx prisma generate

RUN npm run build example
# CMD [ "npm", "run", "start:dev", "example" ]

FROM node:alpine AS production
EXPOSE 50051
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma
RUN npm i --omit=dev && npx prisma generate

CMD ["node", "dist/apps/example/src/main"]