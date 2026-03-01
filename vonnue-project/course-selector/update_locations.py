import json
import re

def get_state(uni_name):
    uni_name = uni_name.lower()
    mapping = {
        "kerala": ["kollam", "kalamassery", "calicut", "changanassery", "cape", "malappuram", "kottayam", "wayanad", "thiruvananthapuram", "pathanamthitta", "kozhikode", "thrissur", "ernakulam", "kochi", "thiruvalla", "alappuzha", "idukki", "pala", "muvattupuzha", "kasaragod", "palakkad", "kannur", "kariavattom", "amrita institute of medical sciences", "university of kerala"],
        "maharashtra": ["nagpur", "mumbai", "pune", "thane", "aurangabad", "nashik"],
        "assam": ["guwahati"],
        "uttar pradesh": ["meerut", "allahabad", "ghaziabad", "kanpur", "lucknow", "agra", "varanasi"],
        "jharkhand": ["dhanbad", "ranchi"],
        "andhra pradesh": ["visakhapatnam", "vijayawada"],
        "punjab": ["amritsar", "ludhiana", "chandigarh"],
        "rajasthan": ["jaipur", "kota", "jodhpur"],
        "chhattisgarh": ["raipur"],
        "delhi": ["delhi", "new delhi"],
        "gujarat": ["vadodara", "surat", "ahmedabad", "rajkot"],
        "bihar": ["patna"],
        "madhya pradesh": ["gwalior", "jabalpur", "bhopal"],
        "west bengal": ["kolkata"],
        "tamil nadu": ["madurai", "coimbatore", "chennai"],
        "jammu and kashmir": ["srinagar"],
        "haryana": ["faridabad"],
        "telangana": ["hyderabad"],
        "karnataka": ["bangalore", "bengaluru"]
    }
    
    for state, keywords in mapping.items():
        for kw in keywords:
            if kw in uni_name:
                return state.title()
                
    return "Any" # fallback

with open('courses.js', 'r', encoding='utf-8') as f:
    data = f.read()

# extraction
start_idx = data.find('[')
end_idx = data.rfind(']') + 1

json_str = data[start_idx:end_idx]
courses = json.loads(json_str)

for c in courses:
    if c.get('location') != 'Online':
        state = get_state(c['university'])
        if state != "Any":
            c['location'] = state
        else:
            print("Warning: Could not determine state for", c['university'])

new_json_str = json.dumps(courses, indent=2)

with open('courses.js', 'w', encoding='utf-8') as f:
    f.write(data[:start_idx] + new_json_str + data[end_idx:])

print("Updated courses.js successfully.")
