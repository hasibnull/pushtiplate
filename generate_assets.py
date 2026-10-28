import json, pathlib, urllib.request, urllib.error, base64, os
root = pathlib.Path(__file__).parent
s = json.loads((pathlib.Path.home() / '.claude' / 'settings.json').read_text())
key = s.get('env', {}).get('ANTHROPIC_AUTH_TOKEN', '')
base = 'https://api.meta.ai/v1'

def gen(prompt, out):
    p = root / out
    if p.exists() and p.stat().st_size > 10000:
        print('skip existing', out); return
    p.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(base + '/images/generations',
        data=json.dumps({"model": "muse-image-1.0", "prompt": prompt}).encode(),
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=180) as r:
        d = json.loads(r.read().decode())
    item = d['data'][0]
    if item.get('b64_json'):
        p.write_bytes(base64.b64decode(item['b64_json']))
    else:
        p.write_bytes(urllib.request.urlopen(item['url'], timeout=120).read())
    print('saved', out, p.stat().st_size, 'bytes')

STYLE = "Overhead photo, small steel plate on plain background, warm natural light, realistic, no people, no text. "
gen(STYLE + "Bangladeshi child's meal: white rice, potato pieces, a little lentil dal.", "public/samples/hero.webp")
gen(STYLE + "Bangladeshi child's meal: white rice, potato pieces, lentil dal, and one boiled egg.", "public/samples/hero-tomorrow.webp")
gen(STYLE + "Bangladeshi child's meal: white rice, lentil dal, boiled egg, spinach, banana slices, small glass of milk beside plate.", "public/samples/good.webp")
gen(STYLE + "Bangladeshi child's meal: only white rice and potato pieces, very plain.", "public/samples/low.webp")
gen(STYLE + "Bangladeshi child's meal: white rice, potato pieces, and one boiled egg.", "public/samples/low-tomorrow.webp")
for name, phrase in [
    ("eggs", "one boiled egg on a small steel plate"),
    ("legumes", "a small bowl of lentil dal on a small steel plate"),
    ("flesh", "a small fried fish on a small steel plate"),
    ("vit_a_fruits_veg", "orange sweet potato pieces and papaya on a small steel plate"),
    ("dairy", "a small glass of milk beside a small steel plate"),
]:
    gen(STYLE + f"Bangladeshi child's meal with {phrase}.", f"public/fallback-plates/{name}.webp")
print('DONE')
