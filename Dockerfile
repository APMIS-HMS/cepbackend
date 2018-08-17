FROM node:7


ENV HOME=/usr/src/app
RUN mkdir $HOME
WORKDIR $HOME

RUN npm install --production


RUN npm install -g feathers-cli yarn

COPY . /usr/src/app

EXPOSE 3031

CMD [ "npm", "start" ]
