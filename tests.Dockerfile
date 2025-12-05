FROM node:20-alpine

WORKDIR /app

COPY */package*.json ./
COPY */tsconfig*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "npm run test:e2e"]