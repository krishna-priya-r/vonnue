import json

with open('courses.js', 'r', encoding='utf-8') as f:
    data = f.read()

start_idx = data.find('[')
end_idx = data.rfind(']') + 1
json_str = data[start_idx:end_idx]
courses = json.loads(json_str)

for c in courses:
    streams = c.get('allowed_hs_streams', [])
    if 'Science (Biology)' in streams or 'Science (Computer)' in streams:
        if 'Science (Biology)' in streams: streams.remove('Science (Biology)')
        if 'Science (Computer)' in streams: streams.remove('Science (Computer)')
        if 'Science' not in streams: streams.append('Science')
    c['allowed_hs_streams'] = streams

new_json_str = json.dumps(courses, indent=2)

with open('courses.js', 'w', encoding='utf-8') as f:
    f.write(data[:start_idx] + new_json_str + data[end_idx:])

print("Restored allowed_hs_streams successfully.")
