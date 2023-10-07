FROM node:16-alpine


ENV DATABASE_HOST 127.0.0.1:3306
ENV DATABASE_USER example
ENV DATABASE_PASSWORD example
ENV SOCKET_URL http://localhost:1234
ENV ADMIN_PASSWORD example
ENV PORT 1234

ENV DATABASE_URL mysql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}/pg

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json /usr/src/app/
RUN npm install

# Copying source files
COPY . /usr/src/app

# Building app
RUN npm run build
EXPOSE $PORT

# Running the app
CMD "npm" "run" "start"