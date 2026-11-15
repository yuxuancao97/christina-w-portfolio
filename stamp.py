"""Run before each deploy: python3 stamp.py

Browsers keep the stylesheet and scripts for ten minutes after a visit, so a fresh
deploy can look unchanged (or half changed) on a normal reload. This gives those
files a new address each time, which makes every deploy show up straight away.
"""
import pathlib, re, time

page = pathlib.Path(__file__).with_name('index.html')
html = page.read_text()
stamp = str(int(time.time()))
html, n = re.subn(r'((?:css/style\.css|js/(?:data|art|signature|main)\.js))(?:\?v=\d+)?"', r'\1?v=' + stamp + '"', html)
assert n == 5, n
page.write_text(html)
print('stamped', stamp)
