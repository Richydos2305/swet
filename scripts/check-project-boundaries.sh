#!/usr/bin/env bash
set -euo pipefail

# Enforces one-way dependencies between projects in this repo (apps and libs).
#
# check_boundary <project dir> <pattern a project must not import>
# Add a line per forbidden dependency to extend this to new projects.

failed=0

check_boundary() {
  project="$1"
  pattern="$2"

  if grep -rln "$pattern" "$project/src" 2>/dev/null; then
    echo "$project must not import \"$pattern\""
    failed=1
  fi
}

check_boundary libs/swet-common-lib apps/swet-service
check_boundary libs/swet-common-lib @swet/integration

check_boundary libs/swet-integration-lib apps/swet-service

exit "$failed"
