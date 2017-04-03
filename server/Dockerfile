FROM alpine:3.5

RUN apk --update add ca-certificates
COPY bin/cors-proxy /opt/
EXPOSE 3000

CMD ["/opt/cors-proxy"]