FROM node:lts-bullseye

WORKDIR /usr/src/app
COPY . .
EXPOSE 3000

RUN chown -R node /usr/src/app
USER node
RUN npm install
RUN npm run build
CMD ["npm", "start"]
