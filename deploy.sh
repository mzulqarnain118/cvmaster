#!/bin/bash

# Read the current version number from the version.txt file
VERSION=$(cat version.txt)

# Increment the version number
NEXT_VERSION=$((VERSION + 1))

# Docker build, tag, and push commands with the incremented version number
docker build -t registry-gitlab.softech.co.uk/cv_master/cv_backend .

docker tag registry-gitlab.softech.co.uk/cv_master/cv_backend:latest registry-gitlab.softech.co.uk/cv_master/cv_backend:v$VERSION

docker push registry-gitlab.softech.co.uk/cv_master/cv_backend:v$VERSION

# Update the version.txt file with the new version number
echo $NEXT_VERSION > version.txt

# Print the new version number for confirmation
echo "Deployed version v$VERSION. Next version will be v$NEXT_VERSION."

