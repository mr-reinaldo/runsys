FROM node:18-alpine

WORKDIR /usr/app

COPY . .

RUN npm i

EXPOSE 3000

CMD [ "npm", "run", "start:migrate:deploy" ]