FROM node:23-slim

COPY backend /app/backend
RUN cd /app/backend && npm i

COPY frontend /app/frontend
RUN cd /app/frontend && npm i && npm run build

WORKDIR /app/backend
ENTRYPOINT ["npm", "start"]
