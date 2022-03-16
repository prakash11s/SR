ARG REACT_APP_PROVIDER=https://signin.serviceright.nl/oauth
ARG REACT_APP_CLIENT_ID=49
ARG REACT_APP_REDIRECT_URI=https://dashboard.serviceright.nl
ARG REACT_APP_TOKEN_ENDPOINT=https://api.serviceright.app/oauth/token
ARG REACT_APP_API_ENDPOINT=https://api.serviceright.app
ARG REACT_APP_VOIP_ENDPOINT=voip.serviceright.nl
ARG REACT_APP_VOIP_ENDPOINT_PORT=8089
ARG REACT_APP_WEBSOCKET_AUTH_ENDPOINT=https://api.serviceright.nl/oauth/websocket
ARG REACT_APP_WEBSOCKET_BASE_URL=ws.serviceright.nl
ARG REACT_APP_PARTNER_API_ENDPOINT=https://partners.serviceright.app

# build environment
FROM node:12.2.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

ARG REACT_APP_PROVIDER
ARG REACT_APP_CLIENT_ID
ARG REACT_APP_REDIRECT_URI
ARG REACT_APP_TOKEN_ENDPOINT
ARG REACT_APP_API_ENDPOINT
ARG REACT_APP_VOIP_ENDPOINT
ARG REACT_APP_VOIP_ENDPOINT_PORT
ARG REACT_APP_GOOGLE_MAP_API
ARG REACT_APP_STRIPE_PUBLISHABLE_KEY
ARG NODE_ENV
ARG REACT_APP_WEBSOCKET_BASE_URL
ARG REACT_APP_WEBSOCKET_AUTH_ENDPOINT
ARG REACT_APP_PARTNER_API_ENDPOINT


RUN echo "REACT_APP_PROVIDER: $REACT_APP_PROVIDER"
RUN echo "REACT_APP_STRIPE_PUBLISHABLE_KEY: $REACT_APP_STRIPE_PUBLISHABLE_KEY"
RUN echo "REACT_APP_CLIENT_ID: $REACT_APP_CLIENT_ID"
RUN echo "REACT_APP_REDIRECT_URI: $REACT_APP_REDIRECT_URI"
RUN echo "REACT_APP_TOKEN_ENDPOINT: $REACT_APP_TOKEN_ENDPOINT"
RUN echo "REACT_APP_API_ENDPOINT: $REACT_APP_API_ENDPOINT"
RUN echo "REACT_APP_VOIP_ENDPOINT: $REACT_APP_VOIP_ENDPOINT"
RUN echo "REACT_APP_VOIP_ENDPOINT_PORT: $REACT_APP_VOIP_ENDPOINT_PORT"
RUN echo "REACT_APP_GOOGLE_MAP_API: $REACT_APP_GOOGLE_MAP_API"
RUN echo "REACT_APP_GOOGLE_MAP_API: $REACT_APP_WEBSOCKET_AUTH_ENDPOINT"

# package.lock
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Permission fix on AWS
RUN npm config set unsafe-perm true

# npm installation
RUN npm ci
RUN npm install react-scripts@3.4.0 -g --silent
COPY . /app
RUN npm run build

# production environment
FROM nginx:1.17.8-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY conf/nginx/production.nginx.conf /etc/nginx/conf.d/nginx.conf
COPY conf/nginx/gzip.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]