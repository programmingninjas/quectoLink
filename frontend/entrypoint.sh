#!/bin/sh

# Set a default value for IP if not provided
: ${IP:=localhost:5000}

# Find the file starting with index and ending with .js inside dist/assets
file=$(find /usr/share/nginx/html/assets -type f -name 'index*.js')

# Check if the file was found
if [ -n "$file" ]; then
    # Replace localhost:5000 with the value of $IP in the found file
    sed -i "s|http://localhost:5000|${IP}|g" "$file"
else
    echo "No index*.js file found in /usr/share/nginx/html/assets"
fi

# Start Nginx
exec nginx -g 'daemon off;'
