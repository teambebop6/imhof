#!/bin/bash
# Decrypt the private key
openssl aes-256-cbc -K $encrypted_424b72c7dc47_key -iv $encrypted_424b72c7dc47_iv -in ./travis/id_rsa_deploy_teambebop6.enc -out id_rsa_deploy_teambebop6 -d

# Start SSH agent
eval $(ssh-agent -s)

# Set the permission of the key
chmod 600 id_rsa_deploy_teambebop6

# Add the private key to the system
ssh-add id_rsa_deploy_teambebop6

git clone git@github.com:graspworld/imhof-secret.git ../imhof-secret