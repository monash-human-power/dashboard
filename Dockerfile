FROM node:alpine AS client

WORKDIR /app/client

COPY client/package.json /app/client
COPY client/yarn.lock /app/client
RUN yarn install

COPY client /app/client

RUN yarn build

CMD [ "yarn", "start" ]

EXPOSE 3000

FROM node:alpine AS server

WORKDIR /app/server

COPY server/package.json /app/server
COPY server/yarn.lock /app/server
RUN yarn install

COPY server /app/server

COPY --from=client /app/client/build /app/client/build

CMD [ "yarn", "start" ]

EXPOSE 5000
