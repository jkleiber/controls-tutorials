@echo off

:: Define variables
set docker-img="controls-dev-img"
set container="controls-dev-container"

:: Stop and remove conflicting containers
docker stop %container%
docker rm %container%

:: Build the image
docker build . -f docker_imgs/dev_docker/Dockerfile -t %docker-img%

:: Run the docker image for the development
docker run --name %container%^
 -d^
 -v %cd%:/app^
 -p 5000:5000^
 %docker-img%
 