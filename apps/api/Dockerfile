FROM node:alpine AS development
ARG PORT=3000
EXPOSE ${PORT} 50051
WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY nest-cli.json nest-cli.json
COPY apps/api apps/api
COPY libs libs
COPY proto proto

RUN pnpm install
RUN pnpm run build api


FROM node:alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
EXPOSE ${PORT} 50051

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm
RUN pnpm install --production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/api/src/main"]