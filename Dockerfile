FROM node:12.2.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", “run”, "start:prod" ]

# RUN mkdir -p /nest
# ADD . /nest
# WORKDIR /nest

# RUN npm i -g @nestjs/cli