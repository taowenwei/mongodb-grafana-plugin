# Use the official Node.js image as base
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 4000 to the outside world
EXPOSE 4000
ENV PORT=4000

# Command to run the application
CMD ["node", "index.mjs"]