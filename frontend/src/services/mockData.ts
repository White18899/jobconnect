export interface Job {
  id: string;
  employer_id: string;
  business_name: string;
  business_type: string;
  employer_verified: boolean;
  title: string;
  description: string;
  category: string;
  salary_min: number;
  salary_max: number;
  salary_period: 'hourly' | 'daily' | 'monthly';
  location_area: string;
  location_city: string;
  working_hours: string;
  requirements: string[];
  vacancies: number;
  status: 'open' | 'closed';
  created_at: string;
}

export interface Worker {
  id: string;
  full_name: string;
  phone?: string;
  isPhoneUnlocked?: boolean;
  photo_url?: string;
  skills: string[];
  experience_years: number;
  preferred_area: string;
  city: string;
  expected_salary_min: number;
  expected_salary_max: number;
  salary_period: string;
  id_proof_type: string;
  id_number_masked: string;
  selfie_url?: string;
  id_doc_url?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
}

export interface Application {
  id: string;
  job_id: string;
  job_title: string;
  job_category: string;
  salary_min: number;
  salary_max: number;
  salary_period: string;
  location_area: string;
  location_city: string;
  working_hours?: string;
  requirements?: string[];
  employer_id: string;
  business_name: string;
  business_type: string;
  contact_person?: string;
  // Private fields revealed only when unlocked
  exact_address?: string;
  latitude?: number;
  longitude?: number;
  map_url?: string;
  employer_phone?: string;
  // Worker info
  worker?: Worker;
  // Statuses
  status: 'applied' | 'accepted' | 'pending_verification' | 'unlocked' | 'rejected' | 'verification_rejected';
  applied_at: string;
  // Payment
  payment_id?: string;
  payment_status?: 'awaiting_payment' | 'submitted' | 'pending_verification' | 'successful' | 'rejected' | 'refunded';
  order_code?: string;
  upi_ref?: string;
  amount?: number;
}

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job_01',
    employer_id: 'ep_01',
    business_name: 'Sri Balaji Auto Care & Service',
    business_type: 'Automobile Workshop',
    employer_verified: true,
    title: 'Experienced Two-Wheeler Mechanic Wanted',
    description: 'Looking for a reliable mechanic for servicing Honda, Hero, TVS, and Bajaj motorcycles. General service, engine tuning, brake overhaul, and oil change.',
    category: 'Mechanic',
    salary_min: 18000,
    salary_max: 24000,
    salary_period: 'monthly',
    location_area: 'KPHB Colony Phase 3',
    location_city: 'Hyderabad',
    working_hours: '9:30 AM - 7:30 PM (Tuesday Off)',
    requirements: ['2+ years experience in motorcycle repair', 'Good knowledge of BS6 fuel injection', 'Punctual and honest'],
    vacancies: 2,
    status: 'open',
    created_at: '2026-10-01T09:00:00Z',
  },
  {
    id: 'job_02',
    employer_id: 'ep_02',
    business_name: 'Annapurna Traditional Sweets & Bakery',
    business_type: 'Sweet Stall & Bakery',
    employer_verified: true,
    title: 'Sweet Maker & Counter Assistant',
    description: 'Need skilled sweet maker for festival preparation (Laddu, Mysore Pak, Kaju Katli) and hot snack frying.',
    category: 'Cook',
    salary_min: 16000,
    salary_max: 22000,
    salary_period: 'monthly',
    location_area: 'SR Nagar Main Road',
    location_city: 'Hyderabad',
    working_hours: '8:00 AM - 5:00 PM',
    requirements: ['Experience in traditional sweets', 'Strict hygiene practices', 'Free lunch & snacks provided'],
    vacancies: 1,
    status: 'open',
    created_at: '2026-10-01T11:30:00Z',
  },
  {
    id: 'job_03',
    employer_id: 'ep_03',
    business_name: 'Ganesh Fabrication Works',
    business_type: 'Metal Fabrication & Welding',
    employer_verified: true,
    title: 'Arc & Gas Welder for Gate/Grill Works',
    description: 'Welding iron gates, safety grills, and tin shed structures. Accurate measurement cutting and finishing.',
    category: 'Welder',
    salary_min: 700,
    salary_max: 950,
    salary_period: 'daily',
    location_area: 'Balanagar Industrial Area',
    location_city: 'Hyderabad',
    working_hours: '9:00 AM - 6:00 PM',
    requirements: ['ARC welding certified or 3+ years experience', 'Safety conscious', 'Overtime paid extra'],
    vacancies: 3,
    status: 'open',
    created_at: '2026-10-02T08:15:00Z',
  },
  {
    id: 'job_04',
    employer_id: 'ep_01',
    business_name: 'Sri Balaji Auto Care & Service',
    business_type: 'Automobile Workshop',
    employer_verified: true,
    title: 'Workshop Helper & Bike Washing Boy',
    description: 'Water washing of two-wheelers, cleaning tools, keeping shop clean, helping mechanics. Freshers welcome.',
    category: 'Helper',
    salary_min: 11000,
    salary_max: 13500,
    salary_period: 'monthly',
    location_area: 'KPHB Colony Phase 3',
    location_city: 'Hyderabad',
    working_hours: '9:00 AM - 7:00 PM',
    requirements: ['Hard working attitude', 'Willing to learn bike mechanics', 'Local resident preferred'],
    vacancies: 1,
    status: 'open',
    created_at: '2026-10-02T10:00:00Z',
  },
  {
    id: 'job_05',
    employer_id: 'ep_04',
    business_name: 'Om Sai Electricals & Plumbing',
    business_type: 'Contractor & Retail',
    employer_verified: true,
    title: 'Residential Electrician for House Wiring',
    description: 'Concealed wiring, MCB distribution board installation, fan and light fitting for apartment projects.',
    category: 'Electrician',
    salary_min: 18000,
    salary_max: 25000,
    salary_period: 'monthly',
    location_area: 'Madhapur',
    location_city: 'Hyderabad',
    working_hours: '9:30 AM - 6:30 PM',
    requirements: ['Own two-wheeler preferred for travel', 'Experience with 3-phase wiring', 'Basic tools proficiency'],
    vacancies: 2,
    status: 'open',
    created_at: '2026-10-02T12:00:00Z',
  },
];

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'wp_01',
    full_name: 'Ramesh Kumar Goud',
    phone: '+91 9123456780',
    skills: ['Two-Wheeler Mechanic', 'Welder', 'Engine Tuning'],
    experience_years: 4.5,
    preferred_area: 'Kukatpally',
    city: 'Hyderabad',
    expected_salary_min: 18000,
    expected_salary_max: 24000,
    salary_period: 'monthly',
    id_proof_type: 'aadhaar_masked',
    id_number_masked: 'XXXX-XXXX-4912',
    verification_status: 'verified',
  },
  {
    id: 'wp_02',
    full_name: 'Suresh Babu',
    phone: '+91 9848012345',
    skills: ['Cook', 'Sweet Maker', 'Kitchen Helper'],
    experience_years: 3.0,
    preferred_area: 'Ameerpet',
    city: 'Hyderabad',
    expected_salary_min: 16000,
    expected_salary_max: 20000,
    salary_period: 'monthly',
    id_proof_type: 'voter_id',
    id_number_masked: 'VTR-XXX892',
    verification_status: 'verified',
  },
  {
    id: 'wp_03',
    full_name: 'Mohammad Farooq',
    phone: '+91 9700112233',
    skills: ['Arc Welder', 'Fabricator', 'Metal Cutter'],
    experience_years: 6.0,
    preferred_area: 'Sanath Nagar',
    city: 'Hyderabad',
    expected_salary_min: 800,
    expected_salary_max: 1000,
    salary_period: 'daily',
    id_proof_type: 'driving_licence',
    id_number_masked: 'DL-XXXX9014',
    verification_status: 'verified',
  },
];

export const INITIAL_APPLICATIONS: Application[] = [
  // 1. Pending Verification: Employer submitted payment with UTR 428190581920, waiting for admin approval
  {
    id: 'app_01',
    job_id: 'job_01',
    job_title: 'Experienced Two-Wheeler Mechanic Wanted',
    job_category: 'Mechanic',
    salary_min: 18000,
    salary_max: 24000,
    salary_period: 'monthly',
    location_area: 'KPHB Colony Phase 3',
    location_city: 'Hyderabad',
    working_hours: '9:30 AM - 7:30 PM',
    requirements: ['2+ years experience in motorcycle repair', 'Good knowledge of BS6', 'Punctual'],
    employer_id: 'ep_01',
    business_name: 'Sri Balaji Auto Care & Service',
    business_type: 'Automobile Workshop',
    contact_person: 'Venkat Rao',
    exact_address: 'Plot 42, Phase 3, Near Ganesh Temple, KPHB Colony, Hyderabad 500072',
    latitude: 17.4938,
    longitude: 78.3995,
    map_url: 'https://www.google.com/maps/search/?api=1&query=17.4938,78.3995',
    employer_phone: '+91 9876543210',
    worker: INITIAL_WORKERS[0],
    status: 'pending_verification',
    applied_at: '2026-10-01T14:20:00Z',
    payment_id: 'pay_01',
    payment_status: 'pending_verification',
    order_code: 'JC-202610-8812',
    upi_ref: '428190581920',
    amount: 499,
  },
  // 2. Unlocked Application: Previously approved by admin - direct contact & exact location visible!
  {
    id: 'app_02',
    job_id: 'job_03',
    job_title: 'Arc & Gas Welder for Gate/Grill Works',
    job_category: 'Welder',
    salary_min: 700,
    salary_max: 950,
    salary_period: 'daily',
    location_area: 'Balanagar Industrial Area',
    location_city: 'Hyderabad',
    working_hours: '9:00 AM - 6:00 PM',
    requirements: ['ARC welding certified or 3+ years experience', 'Safety conscious'],
    employer_id: 'ep_03',
    business_name: 'Ganesh Fabrication Works',
    business_type: 'Metal Fabrication',
    contact_person: 'Ganesh Reddy',
    exact_address: 'Shed No. 18/C, Phase 2, Main Road, Balanagar Industrial Estate, Hyderabad 500037',
    latitude: 17.4699,
    longitude: 78.4354,
    map_url: 'https://www.google.com/maps/search/?api=1&query=17.4699,78.4354',
    employer_phone: '+91 9440112233',
    worker: INITIAL_WORKERS[2],
    status: 'unlocked',
    applied_at: '2026-09-30T10:00:00Z',
    payment_id: 'pay_02',
    payment_status: 'successful',
    order_code: 'JC-202609-3391',
    upi_ref: '428091182390',
    amount: 499,
  },
  // 3. Accepted: Employer accepted worker; awaiting ₹499 fee payment
  {
    id: 'app_03',
    job_id: 'job_02',
    job_title: 'Sweet Maker & Counter Assistant',
    job_category: 'Cook',
    salary_min: 16000,
    salary_max: 22000,
    salary_period: 'monthly',
    location_area: 'SR Nagar Main Road',
    location_city: 'Hyderabad',
    working_hours: '8:00 AM - 5:00 PM',
    employer_id: 'ep_02',
    business_name: 'Annapurna Traditional Sweets & Bakery',
    business_type: 'Sweet Stall & Bakery',
    contact_person: 'Satyanarayana',
    exact_address: 'Shop No 14/B, Beside Metro Pillar 1042, SR Nagar, Hyderabad 500038',
    latitude: 17.4435,
    longitude: 78.4482,
    employer_phone: '+91 9848012345',
    worker: INITIAL_WORKERS[1],
    status: 'accepted',
    applied_at: '2026-10-02T09:10:00Z',
  },
];
