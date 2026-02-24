import json
import random

courses = []
tiers = [
  {"rankMin": 1, "rankMax": 50, "empRateMin": 92, "empRateMax": 99, "salMin": 800000, "salMax": 2000000, "alRatingMin": 4.5, "alRatingMax": 5.0, "hsMin": 85, "feeBase": 400000},
  {"rankMin": 51, "rankMax": 150, "empRateMin": 80, "empRateMax": 91, "salMin": 400000, "salMax": 800000, "alRatingMin": 4.0, "alRatingMax": 4.5, "hsMin": 70, "feeBase": 250000},
  {"rankMin": 151, "rankMax": 400, "empRateMin": 60, "empRateMax": 79, "salMin": 250000, "salMax": 450000, "alRatingMin": 3.5, "alRatingMax": 4.0, "hsMin": 55, "feeBase": 150000}
]

categories = [
  {"cat": "Engineering", "formats": ["On-Campus"], "streams": ["Science"], "duration": 48, "prefix": "B.Tech in", "fields": ["Computer Science", "Mechanical", "Civil", "Electronics", "Information Technology", "AI & Data Science", "Electrical"]},
  {"cat": "Medical", "formats": ["On-Campus"], "streams": ["Science"], "duration": 66, "prefix": "MBBS", "fields": ["General Medicine"]},
  {"cat": "Medical", "formats": ["On-Campus"], "streams": ["Science"], "duration": 48, "prefix": "B.Sc", "fields": ["Nursing", "Physiotherapy", "Cardiovascular Technology"]},
  {"cat": "Business", "formats": ["On-Campus", "Online", "Hybrid"], "streams": ["Science", "Commerce", "Arts"], "duration": 36, "prefix": "BBA", "fields": ["General", "Logistics", "Marketing", "Hospitality"]},
  {"cat": "Business", "formats": ["On-Campus", "Online"], "streams": ["Science", "Commerce", "Arts"], "duration": 36, "prefix": "B.Com", "fields": ["Finance", "Taxation", "Computer Applications", "Travel & Tourism"]},
  {"cat": "Business", "formats": ["On-Campus", "Online"], "streams": ["Science", "Commerce", "Arts"], "duration": 24, "prefix": "MBA", "fields": ["Finance", "Marketing", "HR", "Operations"]},
  {"cat": "Arts", "formats": ["On-Campus"], "streams": ["Science", "Commerce", "Arts"], "duration": 36, "prefix": "BA", "fields": ["Economics", "English Literature", "History", "Sociology", "Malayalam"]},
  {"cat": "Science", "formats": ["On-Campus", "Online"], "streams": ["Science", "Commerce", "Arts"], "duration": 36, "prefix": "B.Sc", "fields": ["Mathematics", "Physics", "Chemistry", "Botany", "Zoology", "Computer Science"]}
]

uniPrefixes_Kerala = [
  "College of Engineering", "Government Engineering College", "Rajagiri School of", "Mar Athanasius College of", "St. Teresa's College", "Sacred Heart College", "Fatima Mata National College", "Marian College", "Albertian Institute of", "Amrita School of", "FISAT College of", "NSS College", "Sree Kerala Varma College", "Sreenarayanaguru College of", "MES College of", "TKM College of", "Assumption College", "St. Thomas College", "CMS College", "Christ College", "Farook College"
]

keralaCities = ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam", "Malappuram", "Pathanamthitta", "Idukki", "Ernakulam", "Wayanad", "Kasaragod", "Muvattupuzha", "Kalamassery", "Changanassery", "Pala", "Thiruvalla"]

uniPrefixes_India = ["National Institute of", "Indian Institute of", "University of", "State College of", "Global School of", "Institute of Engineering and", "Academy of"]

indiaCities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Allahabad", "Ranchi", "Gwalior", "Jabalpur", "Coimbatore", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh"]

indiaLocations = ["North India", "West India", "East India", "South India"]

idCounter = 1

# Generate 200 Kerala Colleges
for i in range(200):
    tier = random.choice(tiers)
    category = random.choice(categories)
    field = random.choice(category["fields"])
    courseName = "MBBS" if category["cat"] == "Medical" and field == "General Medicine" else f"{category['prefix']} {field}".strip()

    city = random.choice(keralaCities)
    format_type = random.choice(category["formats"])
    locTag = "Online" if format_type == "Online" else "South India"

    isTier1 = tier["rankMax"] == 50
    uniName = ""
    
    if isTier1:
        if category["cat"] == "Engineering":
            elite = ["NIT Calicut", "CET Thiruvananthapuram", "TKM Kollam", "CUSAT Kochi", "Model Engineering College Kochi"]
            uniName = random.choice(elite)
        elif category["cat"] == "Medical":
            elite = ["Government Medical College Thiruvananthapuram", "Government Medical College Kozhikode", "Government Medical College Kottayam", "Amrita Institute of Medical Sciences"]
            uniName = random.choice(elite)
        elif category["cat"] == "Business":
            uniName = "IIM Kozhikode"
        else:
            uniName = "University of Kerala (Kariavattom Campus)"
    else:
        dept = category["cat"] if category["cat"] != "Arts" else "Arts & Science"
        uniName = f"{random.choice(uniPrefixes_Kerala)} {dept}, {city}"

    feeVariance = random.randint(-20, 50) / 100.0
    tFee = int(tier["feeBase"] * (1 + feeVariance))
    cLiving = 0 if format_type == "Online" else int(random.randint(60000, 150000) * (category["duration"] / 12))

    courses.append({
        "id": f"c{idCounter}",
        "name": courseName,
        "university": uniName,
        "country": "India",
        "location": locTag,
        "tuition_fees": tFee,
        "cost_of_living": cLiving,
        "ranking": random.randint(tier["rankMin"], tier["rankMax"]),
        "employability_rate": random.randint(tier["empRateMin"], tier["empRateMax"]),
        "avg_starting_salary": random.randint(tier["salMin"], tier["salMax"]),
        "alumni_rating": round(random.uniform(tier["alRatingMin"], tier["alRatingMax"]), 1),
        "min_hs_percentage": random.randint(tier["hsMin"], tier["hsMin"] + 10),
        "ielts_required": 0,
        "duration_months": category["duration"],
        "format": format_type,
        "allowed_hs_streams": category["streams"],
        "category": category["cat"]
    })
    idCounter += 1

# Generate 200 Rest of India Colleges
for i in range(200):
    tier = random.choice(tiers)
    category = random.choice(categories)
    field = random.choice(category["fields"])
    courseName = "MBBS" if category["cat"] == "Medical" and field == "General Medicine" else f"{category['prefix']} {field}".strip()

    city = random.choice(indiaCities)
    format_type = random.choice(category["formats"])
    locTag = "Online" if format_type == "Online" else random.choice(indiaLocations)

    isTier1 = tier["rankMax"] == 50
    uniName = ""
    
    if isTier1:
        if category["cat"] == "Engineering":
            uniName = f"IIT/NIT {city}"
        elif category["cat"] == "Medical":
            uniName = f"AIIMS {city}"
        elif category["cat"] == "Business":
            uniName = f"IIM {city}"
        else:
            uniName = f"University of {city}"
    else:
        dept = category["cat"] if category["cat"] != "Arts" else "Arts & Science"
        uniName = f"{random.choice(uniPrefixes_India)} {dept} {city}"

    feeVariance = random.randint(-20, 50) / 100.0
    tFee = int((tier["feeBase"] * 1.5) * (1 + feeVariance)) # Out of state a bit more expensive
    cLiving = 0 if format_type == "Online" else int(random.randint(80000, 250000) * (category["duration"] / 12))

    courses.append({
        "id": f"c{idCounter}",
        "name": courseName,
        "university": uniName,
        "country": "India",
        "location": locTag,
        "tuition_fees": tFee,
        "cost_of_living": cLiving,
        "ranking": random.randint(tier["rankMin"], tier["rankMax"]),
        "employability_rate": random.randint(tier["empRateMin"], tier["empRateMax"]),
        "avg_starting_salary": random.randint(tier["salMin"], tier["salMax"]),
        "alumni_rating": round(random.uniform(tier["alRatingMin"], tier["alRatingMax"]), 1),
        "min_hs_percentage": random.randint(tier["hsMin"], tier["hsMin"] + 10),
        "ielts_required": 0,
        "duration_months": category["duration"],
        "format": format_type,
        "allowed_hs_streams": category["streams"],
        "category": category["cat"]
    })
    idCounter += 1

# Generate CAPE Colleges
cape_colleges = [
    {"name": "College of Engineering Muttathara", "city": "Thiruvananthapuram"},
    {"name": "College of Engineering Perumon", "city": "Kollam"},
    {"name": "College of Engineering Pathanapuram", "city": "Kollam"},
    {"name": "College of Engineering Aranmula", "city": "Pathanamthitta"},
    {"name": "College of Engineering Kidangoor", "city": "Kottayam"},
    {"name": "College of Engineering Vadakara", "city": "Kozhikode"},
    {"name": "College of Engineering Thalassery", "city": "Kannur"},
    {"name": "College of Engineering Trikaripur", "city": "Kasaragod"},
    {"name": "College of Engineering Munnar", "city": "Idukki"},
    {"name": "Institute of Management and Technology (IMT) Punnapra", "city": "Alappuzha", "cat": "Business"},
    {"name": "Kerala Institute of Making the Best (KIMB) Punnapra", "city": "Alappuzha", "cat": "Business"},
    {"name": "Sagara Hospital Punnapra", "city": "Alappuzha", "cat": "Medical"}
]

for cape in cape_colleges:
    cat = cape.get("cat", "Engineering")
    category = next((c for c in categories if c["cat"] == cat and "On-Campus" in c["formats"]), categories[0])
    field = random.choice(category["fields"])
    if cat == "Medical" and field == "General Medicine":
        courseName = "MBBS"
    else:
        courseName = f"{category['prefix']} {field}".strip()
        
    tier = tiers[1] # Assume Tier 2 for CAPE
    feeVariance = random.randint(-10, 10) / 100.0
    tFee = int((tier["feeBase"] * 0.8) * (1 + feeVariance)) # Government subsidized
    cLiving = int(random.randint(60000, 120000) * (category["duration"] / 12))

    courses.append({
        "id": f"c{idCounter}",
        "name": courseName,
        "university": cape["name"] + f" (CAPE)",
        "country": "India",
        "location": "South India",
        "tuition_fees": tFee,
        "cost_of_living": cLiving,
        "ranking": random.randint(tier["rankMin"], tier["rankMax"]),
        "employability_rate": random.randint(tier["empRateMin"], tier["empRateMax"]),
        "avg_starting_salary": random.randint(tier["salMin"], tier["salMax"]),
        "alumni_rating": round(random.uniform(tier["alRatingMin"], tier["alRatingMax"]), 1),
        "min_hs_percentage": random.randint(tier["hsMin"], tier["hsMin"] + 5),
        "ielts_required": 0,
        "duration_months": category["duration"],
        "format": "On-Campus",
        "allowed_hs_streams": category["streams"],
        "category": cat
    })
    idCounter += 1

with open('d:/krishna/vonnuee proj/course-selector/courses.js', 'w', encoding='utf-8') as f:
    f.write('const coursesData = ' + json.dumps(courses, indent=2) + ';\n')

print("Generating 400+ combined Mock Courses (including CAPE) complete!")
