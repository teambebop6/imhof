#!/bin/bash
# Decrypt the private key
openssl aes-256-cbc -K $encrypted_424b72c7dc47_key -iv $encrypted_424b72c7dc47_iv -in id_rsa_deploy_teambebop6.enc -out ~/.ssh/id_rsa -d
# Set the permission of the key
chmod 600 ~/.ssh/id_rsa

# Start SSH agent
eval $(ssh-agent)
# Add the private key to the system
ssh-add ~/.ssh/id_rsa

git clone git@github.com:graspworld/imhof-secret.git ../imhof-secret