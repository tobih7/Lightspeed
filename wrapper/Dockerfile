FROM nginx:alpine
EXPOSE 80/tcp
COPY --chown=1000 index.html /usr/share/nginx/html
COPY --chown=1000 main.js /usr/share/nginx/html
COPY --chown=1000 styles.css /usr/share/nginx/html
COPY default.conf.template /etc/nginx/templates/
