FROM node:20.9.0-alpine
WORKDIR /app
COPY . /app
RUN npm install -g @angular/cli
RUN npm install --legacy-peer-deps
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]