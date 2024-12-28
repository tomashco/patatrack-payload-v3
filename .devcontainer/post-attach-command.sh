#!/bin/bash

source .devcontainer/_functions.sh;
source ~/.asdf/asdf.sh;

# Enable corepack for the client.
# This MUST ALWAYS be the last instructions in this script.
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install nodejs latest

asdf global nodejs latest

corepack enable;

asdf plugin-add pnpm
asdf install pnpm latest

asdf global pnpm latest