FROM alpine:3.5

RUN apk --update add ca-certificates openssl certbot
COPY bin/cors-proxy /opt/
EXPOSE 80 443

CMD ["/opt/cors-proxy"]