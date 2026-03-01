import json

with open('courses.js', 'r', encoding='utf-8') as f:
    data = f.read()

start_idx = data.find('[')
end_idx = data.rfind(']') + 1
json_str = data[start_idx:end_idx]
courses = json.loads(json_str)

for c in courses:
    streams = c.get('allowed_hs_streams', [])
    if 'Science' in streams:
        streams.remove('Science')
        
        # Determine which science stream to add based on category or course name
        cat = c.get('category')
        name = c.get('name').lower()
        
        if cat == 'Medical':
            streams.append('Science (Biology)')
        elif cat == 'Engineering':
            streams.append('Science (Computer)')
        elif 'computer' in name or 'math' in name or 'physics' in name or 'electronics' in name:
            streams.append('Science (Computer)')
        elif 'bio' in name or 'zoo' in name or 'botany' in name or 'nursing' in name or 'physio' in name or 'cardio' in name:
            streams.append('Science (Biology)')
        else:
            # For Business, Arts, other Pure Sciences, generally both are allowed
            streams.append('Science (Biology)')
            streams.append('Science (Computer)')
            
    c['allowed_hs_streams'] = streams

new_json_str = json.dumps(courses, indent=2)

with open('courses.js', 'w', encoding='utf-8') as f:
    f.write(data[:start_idx] + new_json_str + data[end_idx:])

print("Updated allowed_hs_streams successfully.")
