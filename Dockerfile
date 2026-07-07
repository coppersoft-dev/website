FROM nginxinc/nginx-unprivileged:alpine

COPY images/ /usr/share/nginx/html/images/
COPY *.html main.css main.js /usr/share/nginx/html/

EXPOSE 8080
