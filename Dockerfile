FROM node:20.2.0

# Set the working directory to /app
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code into the Docker image
COPY . .


# Run the app
CMD ["npm", "start"]
