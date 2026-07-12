# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose backend port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]