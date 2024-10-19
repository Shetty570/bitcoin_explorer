# Stage 1: Install dependencies
FROM node:18-bullseye AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install

# Stage 2: Build the application
FROM node:18-bullseye AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build

# Stage 3: Production image
FROM node:18-bullseye AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# # Copy the .env file
# COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]
