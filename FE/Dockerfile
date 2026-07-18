FROM node:22-alpine

WORKDIR /FE

RUN npm install -g live-server

COPY . .

EXPOSE 8080

CMD ["live-server", "--host=0.0.0.0", "--port=8080", "--no-browser"]