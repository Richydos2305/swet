#!/usr/bin/env bash
set -euo pipefail

# Guards against large files entering the repo.
#
# Usage:
#   scripts/check-large-files.sh              # checks every tracked file in the repo
#   scripts/check-large-files.sh file1 file2  # checks only the given files (e.g. from lint-staged)

max_bytes=$((256 * 1024)) # 256 kb

# Paths allowed to exceed the limit (e.g. lock files).
allowlist=(
  "pnpm-lock.yaml"
)

is_allowlisted() {
  local base
  base="$(basename "$1")"
  for allowed in "${allowlist[@]}"; do
    [[ "$base" == "$allowed" ]] && return 0
  done
  return 1
}

check_file() {
  file="$1"
  [ -f "$file" ] || return 0
  is_allowlisted "$file" && return 0

  size="$(wc -c < "$file" | tr -d ' ')"
  if [ "$size" -gt "$max_bytes" ]; then
    echo "$file is $size bytes, exceeds $max_bytes byte limit"
    failed=1
  fi
}

failed=0

if [ "$#" -gt 0 ]; then
  for file in "$@"; do
    check_file "$file"
  done
else
  while IFS= read -r file; do
    check_file "$file"
  done < <(git ls-files)
fi

exit "$failed"
