# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose the application's port
EXPOSE 3001

# Run the application
CMD ["npm", "start"]
