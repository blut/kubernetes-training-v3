# Fertiges Dockerfile für das simulierte Backend
FROM node:20-alpine

WORKDIR /app
COPY server.js .

ENV DATA_FILE=/data/items.json
VOLUME ["/data"]
EXPOSE 9090

USER node
CMD ["node", "server.js"]
