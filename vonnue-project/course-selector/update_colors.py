import os

def update_colors(file_path, replacements):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    for search, replace in replacements:
        content = content.replace(search, replace)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

update_colors('style.css', [
    ('#050505', '#030816'),           # Dark navy background
    ('#eab308', '#3b82f6'),           # Primary accent -> Blue
    ('#facc15', '#60a5fa'),           # Light accent -> Light blue
    ('#ca8a04', '#2563eb'),           # Dark accent -> Dark blue
    ('#fbbf24', '#3b82f6'),           # Border top match -> Blue
    ('#fde047', '#bfdbfe'),           # Match badge text -> Lightest blue
    ('color: #000;', 'color: #ffffff;'), # Button text -> White
    ('rgba(234, 179, 8', 'rgba(59, 130, 246'),
    ('rgba(202, 138, 4', 'rgba(37, 99, 235'),
    ('rgba(250, 204, 21', 'rgba(96, 165, 250'),
    ('rgba(251, 191, 36', 'rgba(59, 130, 246')
])

update_colors('details.js', [
    ('#eab308', '#3b82f6'),           # Match label -> Blue
    ('#facc15', '#60a5fa'),           # Star rating -> Light blue
    ('rgba(234, 179, 8', 'rgba(59, 130, 246'),
    ('#f0883e', '#60a5fa'),           # Financials orange -> Light blue
    ('rgba(240, 136, 62', 'rgba(96, 165, 250')
])

update_colors('app.js', [
    ('#eab308', '#3b82f6')            # Medium match badge color -> Blue
])

update_colors('background.js', [
    ('vec3(0.02, 0.02, 0.03)', 'vec3(0.012, 0.02, 0.05)'), # bg_color
    ('vec3(0.92, 0.70, 0.03)', 'vec3(0.12, 0.35, 0.95)'), # color1 and ambient
    ('vec3(0.79, 0.54, 0.02)', 'vec3(0.25, 0.55, 0.98)')  # color2
])
