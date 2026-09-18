FROM nginxinc/nginx-unprivileged:alpine

COPY images/ /usr/share/nginx/html/images/
COPY downloads/ /usr/share/nginx/html/downloads/
COPY *.html *.css main.js /usr/share/nginx/html/
COPY wire-loop/ /usr/share/nginx/html/wire-loop/

EXPOSE 8080
