# Use the official Node.js docker image as a base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available) for installing dependencies
COPY package*.json ./
COPY ./node_modules ./node_modules

# Install dependencies
RUN npm install

# Copy the rest of application code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Command to run application
# Make fetch.sh executable
RUN chmod +x fetch.sh

# Define the files at build time
ARG Meta
ARG Site

# Command to run the fetch.sh script
CMD ["./fetch.sh", "$Meta", "$Site"]
