FROM node:19-alpine3.16

WORKDIR /usr/app

COPY . .


RUN npm ci

EXPOSE 3000

CMD [ "npm", "run", "start:migrate:deploy" ]