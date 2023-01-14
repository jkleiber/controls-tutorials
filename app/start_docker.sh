# Define variables
docker-img="controls-img"
container="controls-container"

# Build the image
docker build docker_imgs/prod_docker/Dockerfile -t ${docker-img}

# Stop and remove conflicting containers
docker stop ${container}
docker rm ${container}

# Run the docker image for the backend
docker run --name ${container} \
    -d \
    -v $(pwd):/app \
    -p 5000:5000 \
    ${docker-img}
