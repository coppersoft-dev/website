FROM nginx/nginx-unprivileged:1.31.8-alpine3.24-slim@sha256:629d3227f39ec10201345e420e2d9d430e463a9893d374b515a8eb6541e71938

ARG GIT_SHA=unknown

COPY images/ /usr/share/nginx/html/images/
COPY downloads/ /usr/share/nginx/html/downloads/
COPY migration/ /usr/share/nginx/html/migration/
COPY *.html *.css main.js /usr/share/nginx/html/

# Expose the built revision so deployments can be verified (see PR preview workflow).
COPY <<EOF /usr/share/nginx/html/version.txt
${GIT_SHA}
EOF

EXPOSE 8080
