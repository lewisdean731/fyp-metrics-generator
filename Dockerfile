FROM node:14-alpine as compiler

WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm install

COPY ./ ./
RUN npm run compile

FROM node:14-alpine
WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm install --only=production
COPY --from=compiler /opt/app/dist ./dist

CMD ["node", "dist/index.js"]
