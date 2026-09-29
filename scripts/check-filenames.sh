#!/usr/bin/env bash
set -euo pipefail

# Validates file naming convention:
# - .ts/.js files: lowercase letters, digits, '.', '-' only (no uppercase, no '_')
# - all other files: letters (any case), digits, '.', '-', '_'
#
# Usage:
#   scripts/check-filenames.sh            # checks every tracked file in the repo
#   scripts/check-filenames.sh file1 file2 ...   # checks only the given files (e.g. from lint-staged)

failed=0

check_file() {
  file="$1"
  base="$(basename "$file")"

  if [[ "$base" == *.ts || "$base" == *.js ]]; then
    if [[ ! "$base" =~ ^[a-z0-9.-]+$ ]]; then
      echo "Invalid filename: $file (.ts/.js files must be lowercase letters, digits, '.', '-' only)"
      failed=1
    fi
  else
    if [[ ! "$base" =~ ^[A-Za-z0-9._-]+$ ]]; then
      echo "Invalid filename: $file (only letters, digits, '.', '-', '_' are allowed)"
      failed=1
    fi
  fi
}

if [ "$#" -gt 0 ]; then
  for file in "$@"; do
    check_file "$file"
  done
else
  while IFS= read -r file; do
    check_file "$file"
  done < <(git ls-files)
fi

if [ "$failed" -ne 0 ]; then
  exit 1
fi
