FROM node:alpine as node
COPY main.ts .
RUN npm install -g typescript
RUN tsc main.ts -t esnext --outDir /usr/share/nginx/html

FROM nginx:alpine
EXPOSE 80/tcp
COPY --from=node --chown=1000 /usr/share/nginx/html/main.js /usr/share/nginx/html/
COPY --chown=1000 index.html /usr/share/nginx/html
COPY --chown=1000 styles.css /usr/share/nginx/html
COPY default.conf.template /etc/nginx/templates/
