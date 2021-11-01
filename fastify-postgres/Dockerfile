FROM node:14-alpine

WORKDIR /src
COPY package.json /
EXPOSE 3000

# on CI normaly you use npm ci / npm clean-install
RUN npm install
COPY . /
CMD ["npm", "start"]


