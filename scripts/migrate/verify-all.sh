cd /tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/tools
for pair in GRiC:gric Promises:promises RLC:rlc AHFIA:ahfia Imara:imara Inuka:inuka KPFoundation:kenya-power-foundation SFA:sfa CoopFoundation:coop-bank-foundation RSIF:rsif; do
  n=${pair%%:*}; s=${pair##*:}
  echo "=== $n"; node verify.mjs "auxilia/CS - $n.dc.html" /home/user/Auxilia-v2/dist/work/$s.html
done
