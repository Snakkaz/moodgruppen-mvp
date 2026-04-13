#!/bin/bash
# Overvåk contentai.petersendc.no for nye besøk (ikke fra Stians IP-er)
LOG="/var/log/nginx/access.log"
SEEN="/tmp/contentai-seen-ips.txt"
touch "$SEEN"

# Filtrer ut interne/kjente IP-er (Cloudflare proxyer, localhost)
grep "contentai" "$LOG" 2>/dev/null | \
  grep -v "_next/static\|favicon\|_rsc=" | \
  grep -E "GET /( |\")|GET /pipeline|GET /generate|GET /settings|GET /clients|POST /api" | \
  awk '{print $1}' | sort -u | while read ip; do
    if ! grep -q "^${ip}$" "$SEEN"; then
      echo "$ip" >> "$SEEN"
      # Hent siste request fra denne IP-en
      last=$(grep "$ip" "$LOG" | grep "contentai" | grep -v "_next/static\|_rsc=" | tail -1)
      echo "NEW_VISITOR|$ip|$last"
    fi
  done

# Vis siste aktivitet (siste 30 min)
echo "---RECENT---"
grep "contentai" "$LOG" 2>/dev/null | \
  grep -v "_next/static\|favicon\|_rsc=\|\.js\|\.css\|\.ico\|\.png" | \
  grep -E "GET /|POST /" | \
  awk -v cutoff="$(date -d '30 minutes ago' '+%d/%b/%Y:%H:%M' 2>/dev/null || date '+%d/%b/%Y:%H:%M')" '{print $0}' | \
  tail -10
