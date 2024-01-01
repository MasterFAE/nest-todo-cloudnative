FROM node:alpine AS development
EXPOSE 50052
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json nest-cli.json
COPY libs libs
COPY apps/todo apps/todo
COPY prisma ./prisma/
COPY proto proto

RUN npm install && npx prisma generate

RUN npm run build todo

FROM node:alpine AS production
EXPOSE 50052
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./


COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma

RUN npm install --omit=dev && npx prisma generate

CMD ["node", "dist/apps/todo/src/main"]