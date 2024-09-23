#!/bin/bash

# Read the current version number from the version.txt file
VERSION=$(cat version.txt)

# Increment the version number
NEXT_VERSION=$((VERSION + 1))

# Check if the operating system is macOS (darwin)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS (darwin), so add the platform flag for linux/amd64
    echo "Building for linux/amd64 on macOS..."
    docker buildx build --platform linux/amd64 -t registry-gitlab.softech.co.uk/cv_master/cv_backend .
else
    # For other operating systems (e.g., Linux), use the normal build command
    echo "Building for default platform..."
    docker build -t registry-gitlab.softech.co.uk/cv_master/cv_backend .
fi

# Tag and push the Docker image
docker tag registry-gitlab.softech.co.uk/cv_master/cv_backend:latest registry-gitlab.softech.co.uk/cv_master/cv_backend:v$NEXT_VERSION
docker push registry-gitlab.softech.co.uk/cv_master/cv_backend:v$NEXT_VERSION

 # Replace the version in local tools/compose/simple.yml
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS (darwin) uses a different sed syntax
        sudo sed -i '' "s/v$VERSION/v$NEXT_VERSION/g" tools/compose/simple.yml
    else
        # Linux and other Unix systems
        sudo sed -i "s/v$VERSION/v$NEXT_VERSION/g" tools/compose/simple.yml
    fi

# SSH into the EC2 instance and run commands
ssh -i ~/Downloads/gitlab-ci-key.pem ubuntu@34.233.37.55 << EOF
     cd /var/www/cv_master/tools/compose
    # Replace the version in EC2 tools/compose/simple.yml
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS (darwin) uses a different sed syntax
        sudo sed -i '' "s/v$VERSION/v$NEXT_VERSION/g" simple.yml
    else
        # Linux and other Unix systems
        sudo sed -i "s/v$VERSION/v$NEXT_VERSION/g" simple.yml
    fi

    # Update the Docker Compose configuration
    docker compose -f simple.yml up -d

    # Exit the SSH session
    exit
EOF

# Update the version.txt file with the new version number
echo $NEXT_VERSION > version.txt

# Print the new version number for confirmation
echo "Deployed version v$NEXT_VERSION"