FROM node:20-alpine
WORKDIR /app

# Copy package config and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy gateway script
COPY index.js .

EXPOSE 5000
CMD ["node", "index.js"]
