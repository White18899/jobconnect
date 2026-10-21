import sqlite3
import glob
import os

db_files = glob.glob(r'a:\jobconnect\backend\.wrangler\state\v3\d1\miniflare-D1DatabaseObject\*.sqlite')
print(f"Found {len(db_files)} SQLite database file(s):", db_files)

for db_path in db_files:
    print(f"Updating database: {db_path}")
    con = sqlite3.connect(db_path)
    cur = con.cursor()

    # 1. Update jobs
    cur.execute("UPDATE jobs SET location_city = 'Visakhapatnam'")
    cur.execute("UPDATE jobs SET location_area = 'Madhurawada IT SEZ Hill 2' WHERE location_area LIKE '%Hitec%'")
    cur.execute("UPDATE jobs SET location_area = 'Rushikonda Millennium Tech Park' WHERE location_area LIKE '%Ring Road%' OR location_area LIKE '%Bellandur%'")
    cur.execute("UPDATE jobs SET location_area = 'Duvvada VSEZ Corridor' WHERE location_area LIKE '%Financial%' OR location_area LIKE '%Gachibowli%'")
    cur.execute("UPDATE jobs SET location_area = 'Auto Nagar Industrial Tech Hub' WHERE location_area LIKE '%Hinjewadi%'")
    cur.execute("UPDATE jobs SET location_area = 'Siripuram / MVP Colony' WHERE location_area LIKE '%Madhapur%'")
    cur.execute("UPDATE jobs SET location_area = 'Gajuwaka Industrial & Tech Zone' WHERE location_area LIKE '%Koramangala%' OR location_area LIKE '%Indiranagar%'")

    # 2. Update worker_profiles
    cur.execute("UPDATE worker_profiles SET city = 'Visakhapatnam'")
    cur.execute("UPDATE worker_profiles SET preferred_area = 'Madhurawada IT SEZ' WHERE preferred_area LIKE '%Hitec%' OR preferred_area LIKE '%Madhapur%' OR preferred_area LIKE '%Hyderabad%'")
    cur.execute("UPDATE worker_profiles SET preferred_area = 'Rushikonda Millennium Tech Park' WHERE preferred_area LIKE '%Ring Road%' OR preferred_area LIKE '%Bellandur%'")
    cur.execute("UPDATE worker_profiles SET preferred_area = 'Duvvada VSEZ Corridor' WHERE preferred_area LIKE '%Financial%' OR preferred_area LIKE '%Gachibowli%'")
    cur.execute("UPDATE worker_profiles SET preferred_area = 'Auto Nagar Industrial Hub' WHERE preferred_area LIKE '%Hinjewadi%'")
    cur.execute("UPDATE worker_profiles SET preferred_area = 'Gajuwaka Industrial Hub' WHERE preferred_area LIKE '%Koramangala%' OR preferred_area LIKE '%Indiranagar%' OR preferred_area LIKE '%Whitefield%'")
    cur.execute("UPDATE worker_profiles SET preferred_area = 'Madhurawada IT SEZ' WHERE preferred_area IN ('Bangalore', 'Pune', 'City Center', 'Central Area')")

    # 3. Update employer_profiles
    cur.execute("UPDATE employer_profiles SET city = 'Visakhapatnam'")
    cur.execute("UPDATE employer_profiles SET area = 'Madhurawada IT SEZ Hill 2', exact_address = 'IT SEZ Hill No. 2, Madhurawada, Visakhapatnam, Andhra Pradesh - 530048', latitude = 17.8252, longitude = 83.3533 WHERE id IN ('ep_01', 'emp_01') OR area LIKE '%Hitec%'")
    cur.execute("UPDATE employer_profiles SET area = 'Rushikonda Millennium Tech Park', exact_address = 'Millennium Tower B, Rushikonda IT Park, Visakhapatnam, Andhra Pradesh - 530045', latitude = 17.7816, longitude = 83.3779 WHERE id IN ('ep_02', 'emp_02') OR area LIKE '%Ring Road%' OR area LIKE '%Bellandur%'")
    cur.execute("UPDATE employer_profiles SET area = 'Duvvada VSEZ Tech Zone', exact_address = 'Special Economic Zone, Duvvada, Visakhapatnam, Andhra Pradesh - 530046', latitude = 17.7042, longitude = 83.1518 WHERE id IN ('ep_03', 'emp_03') OR area LIKE '%Financial%' OR area LIKE '%Gachibowli%'")
    cur.execute("UPDATE employer_profiles SET area = 'Auto Nagar Technology Park', exact_address = 'Phase 2, Auto Nagar Industrial Estate, Visakhapatnam, Andhra Pradesh - 530012', latitude = 17.7011, longitude = 83.2144 WHERE id IN ('ep_04', 'emp_04') OR area LIKE '%Hinjewadi%'")
    cur.execute("UPDATE employer_profiles SET area = 'Madhurawada IT SEZ', exact_address = 'Visakhapatnam, Andhra Pradesh', latitude = 17.6868, longitude = 83.2185 WHERE area NOT IN ('Madhurawada IT SEZ Hill 2', 'Rushikonda Millennium Tech Park', 'Duvvada VSEZ Tech Zone', 'Auto Nagar Technology Park')")

    con.commit()
    con.close()
    print("Done updating", db_path)
