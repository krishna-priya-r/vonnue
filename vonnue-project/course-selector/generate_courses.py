import json
import random

categories = {
    "Engineering": ["B.Tech Computer Science", "B.Tech Mechanical", "B.Tech Civil", "B.Tech Electrical", "B.Tech Electronics", "B.Tech Information Technology", "B.Tech Chemical", "B.Tech Aerospace", "B.Tech Biotechnology", "M.Tech Computer Science", "M.Tech Structural Engineering"],
    "Medical": ["MBBS", "BDS", "B.Sc Nursing", "B.Pharm", "B.Sc Physiotherapy", "B.Sc Radiology", "B.Sc Anesthesia", "MD General Medicine", "MS Surgery"],
    "Business": ["BBA", "BBM", "MBA Finance", "MBA Marketing", "MBA Operations", "MBA HR", "B.Com Honors", "B.Com Accounting"],
    "Arts": ["BA English", "BA History", "BA Political Science", "BA Sociology", "BA Psychology", "BA Economics", "MA English", "MA Economics", "BSW", "MSW"],
    "Science": ["B.Sc Physics", "B.Sc Chemistry", "B.Sc Mathematics", "B.Sc Zoology", "B.Sc Botany", "B.Sc Computer Science", "B.Sc Electronics", "M.Sc Physics", "M.Sc Mathematics", "BCA", "MCA"]
}

locations = [
    # States
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    # Union Territories
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
    "Online"
]

formats = ["On-Campus", "Online", "Hybrid"]
streams = ["Science", "Commerce", "Arts"]

colleges_prefixes = [
    "National Institute of Technology", "Indian Institute of Technology", "State University", 
    "City College", "Global Academy", "Institute of Advanced Studies", "Royal College", 
    "Pioneer Institute", "Excellence College", "Apex University", "Crescent College", 
    "Heritage Institute", "Modern College of Arts and Science", "Standard Engineering College", 
    "Elite Medical Institute", "Central University", "Presidency College", "Loyola Institute", 
    "Symbiosis Academy", "Christ Institute", "SRM Global", "VIT Campus"
]

courses = []
course_id = 1

# Iterate through every location first to guarantee coverage
for loc in locations:
    for category, names in categories.items():
        for name in names:
            # Generate 2-4 colleges for THIS SPECIFIC course in THIS SPECIFIC location
            num_instances = random.randint(2, 4)
            for _ in range(num_instances):
                college_name = random.choice(colleges_prefixes) + f", {loc}"
                
                # Base stats
                t_fees = random.randint(50000, 500000)
                col_living = random.randint(100000, 400000)
                ranking = random.randint(1, 500)
                emp = random.randint(40, 95)
                # Ensure salaries align logically with ranking and employability
                base_salary = emp * 10000 + (500 - ranking) * 500
                salary = random.randint(int(base_salary * 0.8), int(base_salary * 1.5))
                rating = round(random.uniform(3.0, 5.0), 1)
                min_hs = random.randint(50, 90)
                dur = random.choice([24, 36, 48, 60])
                
                # Force online format if location is Online
                fmt = "Online" if loc == "Online" else random.choice(formats)
                    
                allowed_streams = []
                if category == "Engineering" or category == "Medical" or category == "Science":
                    allowed_streams = ["Science"]
                    if name in ["BCA", "MCA"]:
                        allowed_streams.extend(["Commerce", "Arts"])
                elif category == "Commerce" or category == "Business":
                    allowed_streams = ["Commerce", "Science", "Arts"]
                else:
                    allowed_streams = ["Arts", "Commerce", "Science"]
                    
                syllabus = f"https://www.shiksha.com/search/?q={name.replace(' ', '+')}+syllabus"
                if category == "Business":
                    syllabus = "https://ktuqbank.com/ktu-mba-syllabus/"
                elif category == "Engineering":
                    syllabus = "https://www.ktunotes.in/ktu-btech-2019-scheme-syllabus/"
                elif category == "Medical":
                    syllabus = "https://www.nmc.org.in/information-desk/for-colleges/ug-curriculum/"
                else:
                    syllabus = "https://www.keralanotes.com/p/kerala-university-syllabus.html"

                course = {
                    "id": f"c{course_id}",
                    "name": name,
                    "university": college_name,
                    "country": "India",
                    "location": loc,
                    "tuition_fees": t_fees,
                    "cost_of_living": col_living,
                    "ranking": ranking,
                    "employability_rate": emp,
                    "avg_starting_salary": salary,
                    "alumni_rating": rating,
                    "min_hs_percentage": min_hs,
                    "ielts_required": 0,
                    "duration_months": dur,
                    "format": fmt,
                    "allowed_hs_streams": allowed_streams,
                    "category": category,
                    "syllabus_url": syllabus
                }
                courses.append(course)
                course_id += 1

js_content = "const coursesData = " + json.dumps(courses, indent=2) + ";\n"
with open("courses.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Generated {len(courses)} courses successfully representing all states and UTs!")
