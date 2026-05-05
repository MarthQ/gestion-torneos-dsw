#!/bin/sh

# Ensure assets directory exists
mkdir -p /usr/share/nginx/html/assets

# Generate env.js with container environment variables
# Default API_URL if not set: http://localhost:3000/api
cat <<EOF > /usr/share/nginx/html/assets/env.js
(function (window) {
  window.__env = window.__env || {};
  window.__env.apiUrl = '${API_URL:-http://localhost:3000/api}';
}(this));
EOF

exec "$@"
