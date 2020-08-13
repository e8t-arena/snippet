#!/usr/bin/env bash

# find . -type f -perm +111  -not -path '**/node_modules/*' -not -path '**/.git/*' >> .gitignore

paths=(
  **/node_modules/*
  **/.git/*
)

not_paths=''

for path in ${paths[@]}
do
  # echo $path
  not_paths=$not_paths' -not -path '$path
done

echo $not_paths

find . -type f -perm +111 $not_paths | awk '{print substr($0,3,length($0))}' >> .gitignore
# awk '!NF || !seen[$0]++' .gitignore
result=$(awk '!NF || !seen[$0]++' .gitignore)
echo "$result" > .gitignore
