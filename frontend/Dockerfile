# Use Node.js 20
FROM node:20

# Working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project
COPY . .

# Expose Vite port
EXPOSE 5173

# Start Vite
CMD ["npm", "run", "dev", "--", "--host"]