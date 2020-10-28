# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node:12.18.4

# Set working directory. Paths will be relative this WORKDIR.
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN yarn install

# Copy source files from host computer to the container
COPY . .

# Build the app
#RUN npm run build

# Specify port app runs on
EXPOSE 5000

# Run the app
COPY ./scripts/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
ENTRYPOINT ["/wait-for-it.sh", "--timeout=0", "--strict", "qrder_db:3306", "--", "yarn", "start"]