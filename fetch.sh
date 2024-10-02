#!/bin/bash
echo "argv = ${*}"

# Execute the fetch program with the provided URLs
node build/fetch.js ${*}

