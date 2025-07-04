# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (dev + prod)
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files
COPY . .

# Build the Next.js production app
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy built Next.js files and public assets from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

COPY --from=builder /app ./app





# Set environment to production
# ENV NODE_ENV=production

# Expose Next.js default port
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "start"]

