#!/bin/bash
# usage: compare-page.sh <origFile> <newPath> <name> <theme> <width> [keyName]
T=/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/tools
O=/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/shots
cd $T
orig="$1"; new="$2"; name="$3"; theme="$4"; w="$5"; key="${6:-auxilia-theme-v2}"
h=900; [ "$w" -lt 700 ] && h=800
node shot.mjs "http://localhost:8801/$orig" $O/$name-$theme-$w-orig.png $theme $w $h $key >/dev/null 2>&1 &
node shot.mjs "http://localhost:4321$new" $O/$name-$theme-$w-new.png $theme $w $h $key >/dev/null 2>&1 &
wait
echo "$name $theme $w: $(node cmp.mjs $O/$name-$theme-$w-orig.png $O/$name-$theme-$w-new.png $O/$name-$theme-$w-diff.png | tr '\n' ' ')"
