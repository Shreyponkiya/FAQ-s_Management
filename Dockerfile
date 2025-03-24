# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json


RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Serve React app using a simple web server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose frontend port
EXPOSE 3000
