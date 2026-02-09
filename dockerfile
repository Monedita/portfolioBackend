# stage 1: build the application
FROM node:22 AS build-env
COPY . /app
WORKDIR /app
RUN npm i -g pnpm
RUN CI=true pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm prune --prod

# stage 2: run the application
FROM gcr.io/distroless/nodejs22-debian12
COPY --from=build-env /app/dist /app/dist
COPY --from=build-env /app/package.json /app
COPY --from=build-env /app/node_modules /app/node_modules
WORKDIR /app
EXPOSE 3000
CMD ["dist/index.js"]