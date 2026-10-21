FROM nginxinc/nginx-unprivileged:alpine

COPY images/ /usr/share/nginx/html/images/
COPY downloads/ /usr/share/nginx/html/downloads/
COPY *.html *.css main.js /usr/share/nginx/html/

EXPOSE 8080
