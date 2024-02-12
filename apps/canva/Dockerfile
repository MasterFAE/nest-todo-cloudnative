FROM node:alpine AS development
EXPOSE 50052
WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY nest-cli.json nest-cli.json
COPY libs libs
COPY apps/canva apps/canva
COPY prisma ./prisma/
COPY proto proto

RUN pnpm install && npx prisma generate
RUN pnpm run build canva

FROM node:alpine AS production
EXPOSE 50052
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma

RUN pnpm install --production && npx prisma generate

CMD ["node", "dist/apps/canva/src/main"]