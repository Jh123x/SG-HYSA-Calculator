#!/bin/bash
# Fetch Maybank Save Up Programme page with browser-mimicking headers.
# Maybank's CDN rejects bare curl/client requests.
# Output: HTML saved to the project's logs directory, summary to stdout.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT="${PROJECT_DIR}/logs/maybank_fetch.html"

mkdir -p "${PROJECT_DIR}/logs"

curl -sL --compressed \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36" \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" \
  -H "Accept-Language: en-SG,en;q=0.9" \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "DNT: 1" \
  -H "Connection: keep-alive" \
  -H "Upgrade-Insecure-Requests: 1" \
  -H "Sec-Fetch-Dest: document" \
  -H "Sec-Fetch-Mode: navigate" \
  -H "Sec-Fetch-Site: none" \
  -H "Sec-Fetch-User: ?1" \
  -H "Cache-Control: max-age=0" \
  -o "${OUTPUT}" \
  -w "HTTP %{http_code} | %{size_download} bytes | %{time_total}s\n" \
  "https://www.maybank2u.com.sg/en/personal/saveup/save-up-programme.page"

echo "Saved to: ${OUTPUT}"
