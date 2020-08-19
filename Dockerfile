
FROM node:14.8.0

WORKDIR /app

COPY  ./ $WORKDIR

ENTRYPOINT [ "node", "srv/server.js" ]
