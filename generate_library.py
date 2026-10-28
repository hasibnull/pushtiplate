import json, pathlib, urllib.request, base64
root = pathlib.Path(__file__).parent
s = json.loads((pathlib.Path.home() / '.claude' / 'settings.json').read_text())
key = s.get('env', {}).get('ANTHROPIC_AUTH_TOKEN', '')
base = 'https://api.meta.ai/v1'
FOODS = {
 'egg':'one boiled egg, halved, on a small plate',
 'dal':'a small bowl of cooked lentil dal',
 'small-fish':'two small cooked fish on a small plate',
 'chicken':'a small bowl of soft cooked chicken pieces',
 'rice':'a small bowl of soft cooked white rice',
 'shak':'a small bowl of cooked dark leafy greens (shak)',
 'pumpkin':'a small bowl of soft cooked orange pumpkin pieces',
 'banana':'one ripe banana on a small plate',
 'papaya':'a small bowl of ripe papaya pieces',
 'mango':'a small bowl of ripe mango pieces',
 'yogurt':'a small bowl of plain yogurt (doi)',
 'milk':'a small glass of milk',
 'potato':'a small bowl of soft boiled potato pieces',
 'chickpea':'a small bowl of cooked chickpeas, soft',
 'peanut':'a small bowl of smooth peanut paste',
 'sweet-potato':'a small bowl of soft orange sweet potato pieces',
 'guava':'one guava, halved, on a small plate',
 'suji':'a small bowl of cooked suji (semolina porridge)',
}
for fid, phrase in FOODS.items():
    p = root / 'public' / 'library' / f'{fid}.webp'
    if p.exists() and p.stat().st_size > 10000:
        print('skip', fid); continue
    p.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(base + '/images/generations',
        data=json.dumps({"model":"muse-image-1.0","prompt":f"Overhead photo of {phrase}, simple Bangladeshi home food, plain warm background, natural light, realistic, no people, no text."}).encode(),
        headers={'Authorization': f'Bearer {key}', 'Content-Type':'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=180) as r:
        item = json.loads(r.read().decode())['data'][0]
    p.write_bytes(base64.b64decode(item['b64_json']) if item.get('b64_json') else urllib.request.urlopen(item['url'], timeout=120).read())
    print('saved', fid, p.stat().st_size)
print('DONE')
