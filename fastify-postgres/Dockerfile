FROM node:14-alpine

WORKDIR /src
COPY . /
EXPOSE 3000

# on CI normaly you use npm ci / npm clean-install
RUN npm install
CMD ["npm", "start"]


