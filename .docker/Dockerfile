FROM --platform=amd64 nginx:alpine
RUN mkdir /app
COPY ./ /app

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
