import os, re, sys, html, urllib.parse, collections

root = os.path.abspath(sys.argv[1])
pat = re.compile(r'(?:href|src)="([^"]*)"')
pages, missing, script_hits = [], collections.Counter(), collections.Counter()
logo_forms, build_ids = set(), set()
SCRIPTS = ("current-handler.js", "sorttable.js", "harmonics.js")

for dp, _, fn in os.walk(root):
    for f in fn:
        if not f.endswith(".html"):
            continue
        p = os.path.join(dp, f)
        t = open(p, encoding="utf-8", errors="ignore").read()
        pages.append(p)
        for s in SCRIPTS:
            if s in t:
                script_hits[s] += 1
        for m in pat.findall(t):
            build_ids.update(re.findall(r"buildId=(\d+)", m))
            if "corp_logo" in m:
                logo_forms.add(m)
            u = m.split("#")[0].split("?")[0]
            if not u or u.startswith(("http", "mailto", "javascript", "data:", "#")):
                continue
            u = urllib.parse.unquote(html.unescape(u))
            if not os.path.exists(os.path.normpath(os.path.join(dp, u))):
                missing[u] += 1

app = os.path.join(root, "oxygen-webhelp", "app")
have = lambda n: "yes" if os.path.exists(os.path.join(app, n)) else "NO"

print(f"root            : {root}")
print(f"html pages      : {len(pages)}   files: {sum(len(f) for _,_,f in os.walk(root))}")
print(f"oxygen buildIds : {sorted(build_ids)}")
print("era markers     : commons.css=%s commons.js=%s | bootstrap.css=%s main.css=%s jquery.js=%s"
      % (have("commons.css"), have("commons.js"), have("bootstrap.css"), have("main.css"), have("jquery.js")))
print("script coverage : " + "  ".join(f"{s}={script_hits[s]}/{len(pages)}" for s in SCRIPTS))
print("search index    : " + ("built" if os.path.exists(os.path.join(app, "search", "index", "index.js")) else "MISSING"))
print("logo src forms  : " + (", ".join(sorted(logo_forms)) or "(none)"))
print(f"broken refs     : {len(missing)} distinct, {sum(missing.values())} occurrences")
for k, v in missing.most_common(15):
    print(f"   {v:5d}  {k}")
