FROM node:12-buster

ENV PORT 8080

EXPOSE 8080

WORKDIR /app

LABEL maintainer="roof.is.on.fire.science@gmail.com"

COPY . .
RUN yarn install

RUN yarn watch

CMD ["node", "./dist"]