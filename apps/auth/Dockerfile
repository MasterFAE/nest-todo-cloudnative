FROM node:alpine AS development
EXPOSE 50051
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json nest-cli.json
COPY libs libs
COPY apps/auth apps/auth
COPY prisma ./prisma/
COPY proto proto

RUN cd apps/auth && npm install
RUN npm install && npx prisma generate

RUN npm run build auth

FROM node:alpine AS production
EXPOSE 50051
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./


COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma
COPY --from=development /usr/src/app/apps/auth/package*.json ./dist/apps/auth/

RUN cd dist/apps/auth && npm install --omit=dev
RUN npm install --omit=dev && npx prisma generate

CMD ["node", "dist/apps/auth/src/main"]