# Build the frontend assets during image build so startup is fast.
FROM node:14.15 AS build

# Puppeteer dependencies, from: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
ARG INSTALL_PUPPETEER=false
RUN bash -c "if [ $INSTALL_PUPPETEER == 'true' ] ; then apt-get update && apt-get install -y wget --no-install-recommends \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo \"deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main\" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get purge --auto-remove -y curl \
  && rm -rf /src/*.deb; fi"
WORKDIR /app
RUN bash -c "if [ $INSTALL_PUPPETEER == 'true' ] ; then npm install puppeteer ; fi"
COPY package*.json /app/
COPY patches /app/patches
# The application resides in the root directory (/app). By default, npm restricts
# lifecycle scripts (e.g., postinstall) to execute with elevated privileges.
# To ensure patch-package applies the patch, the --unsafe-perm flag is used here.
RUN npm install --unsafe-perm
COPY ./ /app/
ARG FRONTEND_ENV=production
ENV ANGULAR_APP_ENV=${FRONTEND_ENV}
ARG INSTALL_DEV=false
RUN bash -c "if [ $INSTALL_DEV == 'true' ] ; then npm install -g @angular/cli ; fi"
RUN if [ "$FRONTEND_ENV" = "dev" ]; then npm run build -- --configuration=development; else npm run build -- --configuration=production; fi

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/chip-cert-tool-frontend /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
