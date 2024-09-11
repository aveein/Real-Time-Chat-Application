# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install


# Copy the rest of the application code to the working directory
COPY . .

RUN chmod +x run.sh



# Expose the port that your app runs on (default for Node.js)
EXPOSE 3000

RUN chmod +x /app/run.sh

# Define the command to run your app
CMD ["npm", "start"]

# ENTRYPOINT [ "/app/run.sh" ]

