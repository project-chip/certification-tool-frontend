# Build the frontend assets during image build so startup is fast.
FROM node:24 AS build

# Angular 12's webpack hashes with MD4, which OpenSSL 3 disables by default.
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app
COPY package*.json /app/
COPY patches /app/patches
# The postinstall script runs patch-package to apply the patches in /app/patches.
RUN npm install
COPY ./ /app/
ARG FRONTEND_ENV=production
ENV ANGULAR_APP_ENV=${FRONTEND_ENV}
ARG INSTALL_DEV=false
RUN bash -c "if [ $INSTALL_DEV == 'true' ] ; then npm install -g @angular/cli ; fi"
RUN if [ "$FRONTEND_ENV" = "dev" ]; then npm run build -- --configuration=development; else npm run build -- --configuration=production; fi

FROM nginx:1.30-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/chip-cert-tool-frontend /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
