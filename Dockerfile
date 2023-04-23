# First stage: build the project using Yarn
FROM node:alpine as build

# Set the working directory for subsequent commands
WORKDIR /app

# Copy the project dependencies to the image
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install

# Copy the project source code to the image
COPY . ./

# Build the project
RUN yarn run build

# Second stage: deploy the built artifacts with Nginx
FROM nginx:alpine

# Copy the built artifacts to Nginx's default web root directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx server configuration to the image
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for the container
EXPOSE 80
