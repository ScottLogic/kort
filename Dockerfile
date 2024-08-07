# https://buddy.works/guides/how-dockerize-node-application
# https://medium.com/statuscode/dockerising-a-node-js-and-mongodb-app-d22047e2806f

FROM node:latest
RUN mkdir -p /usr/src/kort
WORKDIR /usr/src/kort
# copy package.json and package-lock.json
COPY package*.json /usr/src/kort/
# the --only=production flag means this will not install the devDependencies
RUN npm install --only=production
COPY . /usr/src/kort
# build browserify bundle
RUN npm run build 
EXPOSE 3000
# https://stackoverflow.com/questions/40873165/use-docker-run-command-to-pass-arguments-to-cmd-in-dockerfile
CMD ["sh", "-c", "node app.js ${MONGO_HOST}"]
