FROM node:alpine AS base
WORKDIR /usr/src/app
RUN npm i -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY nest-cli.json nest-cli.json
COPY libs libs
COPY apps/auth apps/auth
COPY prisma ./prisma/
COPY proto proto

FROM base AS dependencies
WORKDIR /usr/src/app
RUN cd apps/auth && pnpm install
RUN pnpm install && npx prisma generate


FROM dependencies AS build
WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN pnpm run build auth
RUN pnpm prune --prod

FROM build AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules ./node_modules

CMD ["node", "dist/apps/auth/src/main"]