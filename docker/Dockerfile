# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose the port on which the app runs
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
