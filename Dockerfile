FROM node:current-alpine3.11 as builder

WORKDIR /

# Start with `npm ci` before copying app code
# in order to preserve this layer
COPY ./package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV FOR_DOCKER=true

RUN npm run build

FROM nginx
COPY --from=builder /dist /usr/share/nginx/html
EXPOSE 80