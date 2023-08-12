# Use multi-stage build for smaller final image size
# Stage 1: Build the NextJS project
FROM node:alpine AS builder

# Set working directory
WORKDIR .

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the entire project directory
COPY . .

# Build the NextJS project
RUN npm run build

# Stage 2: Use Nginx to serve the built files
FROM nginx:stable-alpine

# Copy the statically generated files from the /out folder
COPY --from=builder ./out /usr/share/nginx/html

# Copy custom Nginx configuration (if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default Nginx port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
