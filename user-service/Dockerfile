# Use the official Node.js image.
FROM node:20

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Install TypeScript globally.
RUN npm install -g typescript

# Compile TypeScript to JavaScript.
RUN tsc

# Expose the port the app runs on.
EXPOSE 5000

# Run the application.
CMD ["node", "dist/server.js"]
