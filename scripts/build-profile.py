"""Generate self-contained GitHub image assets. Run: python3 scripts/build-profile.py."""
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parents[1]
for theme in ('light', 'dark'):
    dark = theme == 'dark'
    bg, fg, muted, border, accent, card = ('#000000', '#f5f5f5', '#b4b4bb', '#292929', '#3d9bff', '#101010') if dark else ('#ffffff', '#121216', '#57575f', '#dfe5ec', '#0070e6', '#f6f9fc')
    def start(height, title, desc):
        return f'''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="{height}" viewBox="0 0 900 {height}" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc>
<defs><radialGradient id="ambient"><stop stop-color="{accent}" stop-opacity=".16"/><stop offset="1" stop-color="{accent}" stop-opacity="0"/></radialGradient><linearGradient id="glass" x2="1" y2="1"><stop stop-color="{accent}" stop-opacity=".08"/><stop offset="1" stop-color="{card}"/></linearGradient></defs>
<style>text{{font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif}} .muted{{fill:{muted}}} .ink{{fill:{fg}}} .blue{{fill:{accent}}} @media(prefers-reduced-motion:reduce){{.moving{{display:none}}}}</style>
<rect x=".5" y=".5" width="899" height="{height-1}" rx="22" fill="{bg}" stroke="{border}"/>
'''
    def text(x,y,value,size=14,fill=None,weight=400):
        return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" fill="{fill or fg}">{escape(value)}</text>'
    s = start(340,'Rambabu Arabandi — AI Engineer','Hyderabad, India. Building production voice agents, MCP tooling and GraphRAG workflows. Open to AI Engineer roles.')
    s += '<ellipse cx="780" cy="120" rx="290" ry="250" fill="url(#ambient)"/>'
    s += text(40,45,'RAMBABU / AI ENGINEER',11,muted,600)
    s += f'<circle cx="44" cy="79" r="4" fill="{accent}"/>' + text(57,83,'Open to AI Engineer roles · Hyderabad, India',12,muted)
    s += text(40,143,'Rambabu Arabandi',46,fg,700)
    s += text(40,183,'I build AI that works',30,fg,600) + text(40,222,'in production.',30,accent,600)
    s += text(40,266,'Voice agents. Connected knowledge. Developer tools.',15,muted)
    s += f'<path d="M40 287H860" stroke="{border}"/>'
    s += text(40,315,'AGENTIC SYSTEMS   /   MCP   /   GRAPHRAG   /   VOICE AI',11,muted,600)
    # restrained voice waveform, with a readable static first frame
    for i in range(27):
        import math
        h = 12 + 56 * abs(math.sin(i*.61))
        x=650+i*7
        s += f'<rect x="{x}" y="{205-h/2}" width="3" height="{h}" rx="1.5" fill="{accent}" opacity=".6"/>'
    s += f'<g class="moving"><rect x="642" y="157" width="205" height="96" rx="16" fill="{bg}" opacity=".3"><animate attributeName="opacity" values=".1;.65;.1" dur="3s" repeatCount="indefinite"/></rect></g>'
    s += text(650,140,'REAL-TIME VOICE',10,muted,600)
    s += '</svg>'
    (ROOT/f'assets/profile-hero-{theme}.svg').write_text(s)
    s = start(256,'From input to action','Listen: real-time STT. Reason: retrieval and tool calling. Act: APIs and voice. A looping signal travels through the pipeline.')
    s += text(32,35,'FROM INPUT TO ACTION',11,muted,600)
    for i,(label,heading,sub) in enumerate([('01 / LISTEN','Real-time voice','LiveKit · Sarvam AI'),('02 / REASON','Context + tools','GraphRAG · MCP'),('03 / ACT','Production systems','APIs · n8n · FastAPI')]):
        x=32+i*286
        s += f'<rect x="{x}" y="62" width="264" height="130" rx="16" fill="url(#glass)" stroke="{border}"/>'
        s += text(x+20,91,label,10,accent,600)+text(x+20,125,heading,21,fg,600)+text(x+20,156,sub,13,muted)
    s += f'<path d="M52 220H848" stroke="{border}" fill="none"/>'
    s += f'<g class="moving"><circle cx="52" cy="220" r="4" fill="{accent}"><animate attributeName="cx" values="52;848" dur="5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.9;1" dur="5s" repeatCount="indefinite"/></circle></g></svg>'
    (ROOT/f'assets/profile-flow-{theme}.svg').write_text(s)
