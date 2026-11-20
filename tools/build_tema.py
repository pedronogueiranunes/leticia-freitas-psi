"""Gera as páginas de tema a partir de tools/tema_content.py.
Uso: python3 tools/build_tema.py
"""
import json, os, sys, urllib.parse
sys.path.insert(0, os.path.dirname(__file__))
from tema_content import PAGES, VERSION
try:
    from artigos_content import ARTICLES
except ImportError:
    ARTICLES = []

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://leticiafreitaspsi.com"
WA = "https://wa.me/5577991105582?text="
WA_ICON = '<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35zM12 0C5.37 0 0 5.37 0 12c0 2.13.56 4.13 1.54 5.86L.06 23.5l5.77-1.51A11.95 11.95 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0zm0 22c-1.85 0-3.59-.5-5.08-1.38l-.36-.21-3.43.9.92-3.32-.24-.38A9.96 9.96 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/></svg>'


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def build(p):
    is_art = p.get("kind") == "article"
    path = ("blog/" if is_art else "") + p["slug"]
    url = f"{SITE}/{path}/"
    wa = WA + urllib.parse.quote(p["wa_msg"])
    faq_ld = {
        "@context": "https://schema.org",
        "@graph": [
            ({"@type": "BlogPosting", "@id": url, "headline": p["crumb"], "datePublished": p.get("date"), "dateModified": p.get("date"), "image": SITE + "/" + p["img"]["og"], "mainEntityOfPage": url, "publisher": {"@id": SITE + "/#business"}} if is_art else {}) ,
            {"@type": "WebPage", "@id": url + "#page", "url": url, "name": p["title"], "description": p["desc"], "inLanguage": "pt-BR",
             "about": p["about"], "isPartOf": {"@id": SITE + "/#website"},
             "author": {"@id": SITE + "/#person"}, "reviewedBy": {"@id": SITE + "/#person"}},
            {"@type": "FAQPage", "mainEntity": [
                {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faq"]]},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Início", "item": SITE + "/"},
                *([{"@type": "ListItem", "position": 2, "name": "Blog", "item": SITE + "/blog/"}] if is_art else []),
                {"@type": "ListItem", "position": 3 if is_art else 2, "name": p["crumb"], "item": url}]},
        ],
    }
    faq_ld["@graph"] = [g for g in faq_ld["@graph"] if g]
    faq_html = "\n".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in p["faq"])
    img = p["img"]
    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-95BFDH34TY"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-95BFDH34TY');gtag('config','AW-18087337282');</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(p['title'])}</title>
<meta name="description" content="{esc(p['desc'])}">
<link rel="canonical" href="{url}">
<meta name="robots" content="{p.get('robots', 'index, follow')}">
<meta property="og:type" content="{'article' if is_art else 'website'}">
<meta property="og:title" content="{esc(p['title'])}">
<meta property="og:description" content="{esc(p['desc'])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/{img['og']}">
<meta property="og:locale" content="pt_BR">
<link rel="icon" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/tema.css?v={VERSION}">
<script type="application/ld+json">{json.dumps(faq_ld, ensure_ascii=False)}</script>
</head>
<body>
<header class="top">
  <a href="/" aria-label="Letícia Freitas Psicóloga, página inicial"><img src="/images/logo_leticia_dark.svg" alt="Letícia Freitas Psicóloga" width="140" height="34"></a>
  <a class="btn" data-wa data-origem="{p['slug']}-topo" href="{wa}">{WA_ICON}<span>Agendar conversa</span></a>
</header>

<main>
  <section class="hero">
    <div>
      <p class="crumb"><a href="/">Início</a> / {'<a href="/blog/">Blog</a> / ' if is_art else ''}{esc(p['crumb'])}</p>{('<p class="byline">Por Letícia Freitas, psicóloga (CRP 03/21534) · ' + p['date_br'] + ' · ' + p['read'] + ' de leitura</p>') if is_art else ''}
      <h1>{p['h1']}</h1>
      <p class="lead">{p['lead']}</p>
      <a class="btn" data-wa data-origem="{p['slug']}-hero" href="{wa}">{WA_ICON}{esc(p['cta_hero'])}</a>
    </div>
    <figure><img src="/{img['src']}" alt="{esc(img['alt'])}" width="640" height="800" fetchpriority="high"></figure>
  </section>

  <article>
{p['body']}
  </article>

  <section class="faq" aria-labelledby="faq-title">
    <article style="padding:0"><h2 id="faq-title">Perguntas frequentes</h2></article>
{faq_html}
  </section>

  <section class="cta">
    <div class="cta-inner">
      <h2>{esc(p['cta_title'])}</h2>
      <p>{esc(p['cta_text'])}</p>
      <a class="btn" data-wa data-origem="{p['slug']}-final" href="{wa}">{WA_ICON}Falar com a Letícia no WhatsApp</a>
    </div>
  </section>

  <p class="related">{p['related']}</p>
</main>

<footer>Letícia Freitas · Psicóloga · CRP 03/21534 · Espaço Viver, R. Dom Climério de Andrade, 145, Recreio, Vitória da Conquista, BA · Atendimento presencial e online</footer>
<script>
document.querySelectorAll('[data-wa]').forEach(function (a) {{
  a.addEventListener('click', function () {{
    if (typeof gtag !== 'function') return;
    gtag('event', 'conversion', {{ send_to: 'AW-18087337282/NJXkCP3p6sYcEMK627BD' }});
    gtag('event', 'whatsapp_click', {{ origem: a.dataset.origem }});
  }});
}});
</script>
</body>
</html>
"""
    out = os.path.join(ROOT, path)
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, "index.html"), "w") as f:
        f.write(html)
    print("ok", p["slug"])


def build_blog_index(arts):
    cards = "\n".join(f'''<a class="post" href="/blog/{a['slug']}/"><img src="/{a['img']['src']}" alt="" width="640" height="477" loading="lazy"><span class="post-meta">{a['date_br']} · {a['read']}</span><h2>{esc(a['crumb'])}</h2><p>{esc(a['desc'])}</p></a>''' for a in arts)
    html = f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-95BFDH34TY"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-95BFDH34TY');</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog | Letícia Freitas, psicóloga</title>
<meta name="description" content="Textos sobre ansiedade, regulação emocional, burnout e terapia online, escritos pela psicóloga Letícia Freitas.">
<link rel="canonical" href="{SITE}/blog/">
<link rel="icon" href="/favicon-32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/tema.css?v={VERSION}">
</head><body>
<header class="top"><a href="/" aria-label="Letícia Freitas Psicóloga, página inicial"><img src="/images/logo_leticia_dark.svg" alt="Letícia Freitas Psicóloga" width="140" height="34"></a></header>
<main class="blog">
<p class="crumb"><a href="/">Início</a> / Blog</p>
<h1>Textos para entender <em>o que você sente</em></h1>
<p class="lead">Ansiedade, emoções intensas, trabalho e vida longe de casa, explicados sem jargão.</p>
<div class="posts">{cards}</div>
<p class="related">Páginas de tema: <a href="/terapia-dbt/">Terapia DBT</a> · <a href="/regulacao-emocional/">Regulação emocional</a> · <a href="/terapia-act/">Terapia ACT</a> · <a href="/sindrome-de-burnout/">Síndrome de burnout</a></p>
</main>
<footer>Letícia Freitas · Psicóloga · CRP 03/21534</footer>
</body></html>
"""
    with open(os.path.join(ROOT, "blog", "index.html"), "w") as f:
        f.write(html)
    print("ok blog index")


for page in PAGES + ARTICLES:
    build(page)
if ARTICLES:
    build_blog_index(sorted(ARTICLES, key=lambda a: a["date"], reverse=True))
