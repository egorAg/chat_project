#################
## DEVELOPMENT ##
#################

# Specify Node Version and Image
FROM node:16-alpine as development

# Specfy working directory
WORKDIR /chat/backend

# Copy package.json and package-lock.json to workdir
COPY package*.json ./

# Install packages
RUN yarn

# Bundle app source
COPY . .

# Build project
RUN yarn build

# Expose port 5001
EXPOSE 5001

################
## PRODUCTION ##
################
FROM node:16-alpine as production

# Set node_env as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set workdi
WORKDIR /chat/backend

# Copy from development image to production image
COPY --from=development /chat/backend .

# Expose port 8080
EXPOSE 8080

# start via node js
CMD ["node", "dist/main"]


