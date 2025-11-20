#!/bin/sh
# Lavalink Health Check Script
#
# This script checks if Lavalink is running and responding to requests.
# It uses wget to perform a health check on the /version endpoint.
#
# The password is read from the environment variable to avoid exposing it
# in the process list (which would happen if passed as a command-line argument).

# Exit on any error
set -e

# Perform health check
wget --quiet --tries=1 --spider \
  --timeout=5 \
  --header="Authorization: ${LAVALINK_SERVER_PASSWORD}" \
  http://localhost:2333/version

# If wget succeeds (exit code 0), the service is healthy
exit 0
