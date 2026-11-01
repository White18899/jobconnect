/**
 * JobWay i18n Core Engine (English • తెలుగు • हिन्दी)
 * Lightweight, offline-first client-side dictionary for JobWay PWA.
 */

(function(window) {
  'use strict';

  var STORAGE_KEY = 'jobway_lang';
  var DEFAULT_LANG = 'en';
  var SUPPORTED_LANGS = ['en', 'te', 'hi'];

  var DICTIONARY = {
    en: {
      lang_switch_title: "Language",
      lang_name_en: "English",
      lang_name_te: "Telugu",
      lang_name_hi: "Hindi",

      // Top Navigation
      nav_find_jobs: "Find Jobs",
      nav_listed_jobs: "Listed Jobs",
      nav_candidates: "Candidates",
      nav_worker_desk: "Worker Desk",
      nav_employer_workspace: "Employer Workspace",
      nav_post_job: "+ Post Job",
      nav_signin: "Sign In",
      nav_get_started: "Get Started →",
      nav_signout: "Sign Out",
      nav_my_profile: "My Profile",
      nav_vacancies: "Vacancies",
      nav_approach: "Approach",
      nav_pricing: "Pricing",

      // Home Hero & Platform
      hero_line_1: "India's direct network for verified software, QA & engineering talent",
      hero_line_2: "& high-impact tech teams — direct verified hiring",
      hero_city: "[ Visakhapatnam ]",
      ios_caption: "VISAKHAPATNAM TECH NETWORK",
      ios_large_title: "Explore Vacancies",
      ios_subhead: "Direct bank payroll • Authenticated trade passes",
      ios_search_ph: "Search roles, skills, or tech stack...",
      ios_tab_jobs: "Find Jobs",
      ios_tab_hire: "Hire Talent",
      ios_trust_1: "Direct Bank Payroll",
      ios_trust_2: "Direct Employer Hiring",
      ios_trust_3: "Vizag IT Corridor",

      platform_approach_tag: "Platform Approach",
      platform_approach_title: "Direct technical network connecting software engineers, QA testers, and technical leaders with vetted engineering employers.",
      platform_approach_desc: "Direct technical network connecting software engineers, QA testers, and technical leaders with vetted engineering employers.",
      start_direct_hiring: "Start Direct Hiring",
      open_positions_tag: "Open Positions",
      featured_vacancies_title: "Featured vacancies",
      see_all_jobs: "See all jobs",
      filter_all: "All",

      // Pricing Section
      pricing_tag: "Transparent Pricing",
      pricing_free_pill: "100% Free for Tech Candidates",
      pricing_title: "Simple pay-per-unlock hiring with zero agency commissions",
      pricing_subtitle: "Directly reach software engineers, QA testers, and tech leaders via verified WhatsApp & phone without monthly subscription lock-ins.",
      starter_pack_title: "Starter Pack",
      starter_pack_period: "/ single unlock",
      starter_pack_desc: "Ideal for hiring a single technical specialist or immediate project replacement.",
      get_starter_pack: "Get Starter Pack",
      growth_bundle_title: "Growth Bundle",
      growth_bundle_period: "/ 5 unlocks (₹49/ea)",
      growth_bundle_desc: "Best value for fast-growing engineering teams closing multi-skill roles.",
      get_growth_bundle: "Get Growth Bundle",

      // Candidates Directory
      talent_candidates_dir_badge: "Talent & Candidates Directory",
      verified_candidates_directory: "Verified Candidates Directory",
      candidates_subhead: "Browse certified software developers, QA leads, and architects with skill-verified passes.",
      selected_btn: "Selected",
      unlock_credits_btn: "Unlock Credits",
      showing_verified_cands: "Showing verified candidates",
      verified_cand_profiles: "100% Verified Candidate Profiles",
      match_label: "MATCH:",
      sort_best_match: "Sort: Best Match % (Recommended)",
      sort_exp_high_low: "Sort: Experience (High to Low)",
      sort_recently_added: "Sort: Recently Added",
      yrs_exp: "Yrs Exp",
      match: "Match",
      verified_candidate: "Verified Candidate",
      shielded_phone: "Shielded Phone:",
      direct_phone: "Direct Phone:",
      select_candidate: "+ Select Candidate",
      selected: "Selected",
      in_workspace: "✓ In Workspace",

      // Search & Filters
      search_vacancies_title: "Search Vacancies",
      search_vacancies_ph: "Role, machine, skill...",
      search_candidates_title: "Search Candidates",
      search_candidates_ph: "Name, trade, skill, machine...",
      category_specialization_title: "Job Category & Specialization",
      all_specializations: "All Specializations",
      your_vacancy_posts: "Your Vacancy Posts",
      see_more: "+ See More",
      see_less: "See Less",
      location_hub_title: "Location Hub / City",
      all_locations: "All Locations (Visakhapatnam)",
      min_salary_title: "Minimum Salary",
      all_pay_scales: "All Pay Scales",
      total_experience_title: "Total Experience",
      all_exp_levels: "All Experience Levels",
      reset_all_filters: "Reset All Filters",
      show_results: "Show Results",
      sort_by: "Sort By",

      // Employer Workspace
      verified_hiring_business: "Verified Hiring Business",
      edit_profile: "Edit Profile",
      employer_desk_title: "Employer Desk",
      employer_desk_desc: "Review applicant profiles and unlock masked direct contact details of certified software engineers, QA testers, and tech leaders across India.",
      post_new_vacancy: "+ Post New Vacancy",
      browse_candidates: "Browse Candidates →",
      buy_unlock_credits: "Buy Unlock Credits",
      stat_received_apps: "Received Applications",
      stat_received_apps_sub: "Candidates applied for your jobs",
      stat_unlocked_contacts: "Unlocked Contacts",
      stat_unlocked_contacts_sub: "Phone numbers ready for calling",
      stat_unlock_balance: "Unlock Balance",
      stat_unlock_balance_sub: "Credits remaining in account",
      received_cands_title: "Received Candidate Applications",
      received_cands_subtitle: "Privacy-protected roster. Unlock contact with 1 credit to initiate direct phone and WhatsApp conversations.",
      selection_cart_badge: "SELECTION CART",
      cands_in_cart: "Candidates in Selection Cart",
      cart_subtext: "(Review details or unlock in 1 click)",
      clear_cart: "Clear Cart",
      unlock_selected: "Unlock Selected",
      years_experience: "Years Experience",
      for_role: "For:",
      contact_unlocked: "Contact Unlocked",
      contact_shielded: "Contact Shielded",
      unlocked: "UNLOCKED",
      in_cart: "IN CART",
      added_label: "Added:",
      pass_details: "Pass Details →",
      call_direct: "Call Direct",
      unlock_credit: "Unlock (1 Credit)",

      // Custom Categories (Employer)
      custom_categories_badge: "Custom Job Specializations",
      custom_categories_title: "Employer Custom Job Categories",
      custom_categories_desc: "Define niche or business-specific job categories tailored to your organization. These sync automatically with your vacancy postings and candidate searches.",
      post_job_opening: "Post a Job Opening",
      add_new_category_label: "+ Add New Custom Category",
      add_new_category_ph: "e.g. Drone Aviation, Marine Logistics, Green Solar Energy...",
      add_category_btn: "Add Category",
      saved_categories_note: "Saved categories immediately become available in your job posting form and filter menus.",
      active_custom_categories: "Your Active Custom Categories",

      // Worker Desk
      verified_professional: "Verified Professional",
      worker_desk_title: "Worker Desk",
      worker_desk_desc: "Track employer review status, update your verified trade qualifications, and manage priority placement.",
      find_more_jobs: "Find More Jobs →",
      stat_applications: "Applications",
      stat_applications_sub: "Direct submissions",
      stat_shortlisted: "Shortlisted",
      stat_shortlisted_sub: "Preparing to call you",
      stat_placement: "Placement",
      stat_placement_active: "Active",
      stat_placement_sub: "Featured in queues",
      my_submitted_apps_title: "My Submitted Applications",
      my_submitted_apps_sub: "Real-time status updates from verified hiring employers",
      trade_profile_details_title: "Trade Profile Details",
      trade_profile_details_sub: "Visible to verified employers when reviewing applications",
      technical_credentials: "Technical Credentials",
      verified_skill_certified: "Verified & Skill Certified",
      profile_strength: "Profile Strength:",
      legal_name: "Full Legal Name",
      discipline_skills: "Primary Discipline & Skills",
      total_tech_exp: "Total Technical Experience",
      edu_qualifications: "Education & Qualifications",
      employer_label: "Employer:",
      applied_label: "Applied:",
      experience_on_file: "Experience on file",
      workplace_shared: "WORKPLACE SHARED",
      maps: "Maps",
      boost_app: "Boost App (₹149)",
      boosted: "Boosted",
      withdraw: "Withdraw",

      // Job Badges & Listing
      verified_employer: "Verified Employer",
      your_vacancy: "Your Vacancy",
      per_month: "mo",
      apply_now: "Apply Now",
      apply_instant: "Apply Instant",
      applied: "Applied",
      view_spec: "View Spec",

      // Modal Listing Translation
      translate_to_te: "తెలుగులో చదవండి",
      translate_to_hi: "हिन्दी में पढ़ें",
      show_original_en: "↺ Show English",
      translating: "Translating..."
    },

    te: {
      lang_switch_title: "భాష",
      lang_name_en: "ఇంగ్లీష్",
      lang_name_te: "తెలుగు",
      lang_name_hi: "హిందీ",

      // Top Navigation
      nav_find_jobs: "ఉద్యోగాలు వెతకండి",
      nav_listed_jobs: "ఉద్యోగాలు",
      nav_candidates: "అభ్యర్థులు",
      nav_worker_desk: "వర్కర్ డెస్క్",
      nav_employer_workspace: "యజమాని డెస్క్",
      nav_post_job: "+ ఉద్యోగం వేయండి",
      nav_signin: "సైన్ ఇన్",
      nav_get_started: "ప్రారంభించండి →",
      nav_signout: "లాగౌట్",
      nav_my_profile: "నా ప్రొఫైల్",
      nav_vacancies: "ఖాళీలు",
      nav_approach: "విధానం",
      nav_pricing: "ధరలు",

      // Home Hero & Platform
      hero_line_1: "ధృవీకరించబడిన సాఫ్ట్‌వేర్, క్యూఏ & ఇంజనీరింగ్ ప్రతిభ కోసం భారతదేశపు ప్రత్యక్ష నెట్‌వర్క్",
      hero_line_2: "& హై-ఇంపాక్ట్ టెక్ బృందాలు — డైరెక్ట్ వెరిఫైడ్ హైరింగ్",
      hero_city: "[ విశాఖపట్నం ]",
      ios_caption: "విశాఖపట్నం టెక్ నెట్‌వర్క్",
      ios_large_title: "ఉద్యోగ ఖాళీలు",
      ios_subhead: "నేరుగా బ్యాంక్ జీతం • ధృవీకరించబడిన ట్రేడ్ పాస్‌లు",
      ios_search_ph: "రోల్స్, నైపుణ్యాలు లేదా టెక్ స్టాక్ వెతకండి...",
      ios_tab_jobs: "ఉద్యోగాలు వెతకండి",
      ios_tab_hire: "నియామకం చేయండి",
      ios_trust_1: "నేరుగా బ్యాంక్ పేరోల్",
      ios_trust_2: "డైరెక్ట్ ఎంప్లాయర్ హైరింగ్",
      ios_trust_3: "వైజాగ్ ఐటీ కారిడార్",

      platform_approach_tag: "ప్లాట్‌ఫారమ్ విధానం",
      platform_approach_title: "సాఫ్ట్‌వేర్ ఇంజనీర్లు, క్యూఏ టెస్టర్లు మరియు సాంకేతిక లీడర్లను ధృవీకరించబడిన సంస్థలతో కలిపే ప్రత్యక్ష వేదిక.",
      platform_approach_desc: "సాఫ్ట్‌వేర్ ఇంజనీర్లు, క్యూఏ టెస్టర్లు మరియు సాంకేతిక లీడర్లను ధృవీకరించబడిన సంస్థలతో కలిపే ప్రత్యక్ష వేదిక.",
      start_direct_hiring: "నేరుగా నియామకం ప్రారంభించండి",
      open_positions_tag: "ప్రస్తుత ఉద్యోగ ఖాళీలు",
      featured_vacancies_title: "ప్రత్యేక ఉద్యోగ ఖాళీలు",
      see_all_jobs: "అన్ని ఉద్యోగాలు చూడండి",
      filter_all: "అన్నీ",

      // Pricing Section
      pricing_tag: "పారదర్శక ధరలు",
      pricing_free_pill: "అభ్యర్థులకు 100% ఉచితం",
      pricing_title: "ఏజెన్సీ కమీషన్లు లేని సులభమైన పే-పర్-అన్‌లాక్ నియామకం",
      pricing_subtitle: "నెలవారీ సబ్‌స్క్రిప్షన్లు లేకుండా ధృవీకరించబడిన వాట్సాప్ & ఫోన్ ద్వారా ఇంజనీర్లను నేరుగా సంప్రదించండి.",
      starter_pack_title: "స్టార్టర్ ప్యాక్",
      starter_pack_period: "/ ఒక్క అన్‌లాక్",
      starter_pack_desc: "ఒకే టెక్నికల్ స్పెషలిస్ట్‌ను తక్షణమే నియమించుకోవడానికి సరైన ప్యాక్.",
      get_starter_pack: "స్టార్టర్ ప్యాక్ పొందండి",
      growth_bundle_title: "గ్రోత్ బండిల్",
      growth_bundle_period: "/ 5 అన్‌లాక్‌లు (₹49/ఒక్కోటి)",
      growth_bundle_desc: "వేగంగా నియామకాలు చేపట్టే ఇంజనీరింగ్ బృందాలకు ఉత్తమ ప్యాక్.",
      get_growth_bundle: "గ్రోత్ బండిల్ పొందండి",

      // Candidates Directory
      talent_candidates_dir_badge: "ప్రతిభ & అభ్యర్థుల డైరెక్టరీ",
      verified_candidates_directory: "ధృవీకరించబడిన అభ్యర్థుల డైరెక్టరీ",
      candidates_subhead: "ధృవీకరించబడిన సాఫ్ట్‌వేర్ డెవలపర్లు, క్యూఏ లీడ్స్ మరియు ఆర్కిటెక్ట్‌ల వివరాలు చూడండి.",
      selected_btn: "ఎంచుకున్నవి",
      unlock_credits_btn: "క్రెడిట్స్ కొనండి",
      showing_verified_cands: "ధృవీకరించబడిన అభ్యర్థులు చూపబడుతున్నారు",
      verified_cand_profiles: "100% ధృవీకరించబడిన అభ్యర్థుల ప్రొఫైల్స్",
      match_label: "మ్యాచ్:",
      sort_best_match: "క్రమబద్ధీకరణ: ఉత్తమ మ్యాచ్ % (సిఫార్సు చేయబడింది)",
      sort_exp_high_low: "క్రమబద్ధీకరణ: అనుభవం (ఎక్కువ నుండి తక్కువ)",
      sort_recently_added: "క్రమబద్ధీకరణ: ఇటీవల చేర్చినవి",
      yrs_exp: "సం. అనుభవం",
      match: "మ్యాచ్",
      verified_candidate: "ధృవీకరించబడిన అభ్యర్థి",
      shielded_phone: "రక్షిత ఫోన్ నంబర్:",
      direct_phone: "ప్రత్యక్ష ఫోన్ నంబర్:",
      select_candidate: "+ అభ్యర్థిని ఎంచుకోండి",
      selected: "ఎంచుకోబడింది",
      in_workspace: "✓ వర్క్‌స్పేస్‌లో ఉంది",

      // Search & Filters
      search_vacancies_title: "ఖాళీలను వెతకండి",
      search_vacancies_ph: "ఉద్యోగం, నైపుణ్యం, విభాగం...",
      search_candidates_title: "అభ్యర్థులను వెతకండి",
      search_candidates_ph: "పేరు, వృత్తి, నైపుణ్యం...",
      category_specialization_title: "ఉద్యోగ విభాగం & స్పెషలైజేషన్",
      all_specializations: "అన్ని విభాగాలు",
      your_vacancy_posts: "మీరు వేసిన ఉద్యోగాలు",
      see_more: "+ మరిన్ని చూడండి",
      see_less: "తక్కువ చూడండి",
      location_hub_title: "ప్రాంతం / నగరం",
      all_locations: "అన్ని ప్రాంతాలు (విశాఖపట్నం)",
      min_salary_title: "కనిష్ట జీతం",
      all_pay_scales: "అన్ని జీతాల శ్రేణులు",
      total_experience_title: "మొత్తం అనుభవం",
      all_exp_levels: "అన్ని అనుభవ స్థాయిలు",
      reset_all_filters: "ఫిల్టర్లు రీసెట్ చేయండి",
      show_results: "ఫలితాలు చూపించు",
      sort_by: "క్రమబద్ధీకరించండి",

      // Employer Workspace
      verified_hiring_business: "ధృవీకరించబడిన వ్యాపారం",
      edit_profile: "ప్రొఫైల్ సవరించండి",
      employer_desk_title: "యజమాని డెస్క్",
      employer_desk_desc: "అభ్యర్థుల ప్రొఫైల్స్ సమీక్షించండి మరియు భారతదేశ వ్యాప్తంగా సర్టిఫైడ్ ఇంజనీర్ల డైరెక్ట్ కాంటాక్ట్ వివరాలను అన్‌లాక్ చేయండి.",
      post_new_vacancy: "+ కొత్త ఉద్యోగ ఖాళీ వేయండి",
      browse_candidates: "అభ్యర్థులను చూడండి →",
      buy_unlock_credits: "క్రెడిట్స్ కొనండి",
      stat_received_apps: "వచ్చిన దరఖాస్తులు",
      stat_received_apps_sub: "మీ ఖాళీలకు దరఖాస్తు చేసిన అభ్యర్థులు",
      stat_unlocked_contacts: "అన్‌లాక్ చేసిన నంబర్లు",
      stat_unlocked_contacts_sub: "కాల్ చేయడానికి సిద్ధంగా ఉన్న నంబర్లు",
      stat_unlock_balance: "మిగిలిన క్రెడిట్స్",
      stat_unlock_balance_sub: "మీ ఖాతాలో మిగిలిన క్రెడిట్స్",
      received_cands_title: "వచ్చిన అభ్యర్థుల దరఖాస్తులు",
      received_cands_subtitle: "గోప్యతతో కూడిన జాబితా. ప్రత్యక్ష ఫోన్ మరియు వాట్సాప్ సంభాషణల కోసం 1 క్రెడిట్‌తో కాంటాక్ట్ అన్‌లాక్ చేయండి.",
      selection_cart_badge: "ఎంపికల కార్ట్",
      cands_in_cart: "కార్ట్‌లో ఉన్న అభ్యర్థులు",
      cart_subtext: "(వివరాలు చూడండి లేదా 1 క్లిక్‌తో అన్‌లాక్ చేయండి)",
      clear_cart: "కార్ట్ ఖాళీ చేయండి",
      unlock_selected: "ఎంచుకున్నవి అన్‌లాక్ చేయండి",
      years_experience: "సంవత్సరాల అనుభవం",
      for_role: "ఉద్యోగం:",
      contact_unlocked: "కాంటాక్ట్ అన్‌లాక్ చేయబడింది",
      contact_shielded: "కాంటాక్ట్ రక్షించబడింది",
      unlocked: "అన్‌లాక్ చేయబడింది",
      in_cart: "కార్ట్‌లో ఉంది",
      added_label: "చేర్చబడింది:",
      pass_details: "పాస్ వివరాలు →",
      call_direct: "నేరుగా కాల్ చేయండి",
      unlock_credit: "అన్‌లాక్ చేయండి (1 క్రెడిట్)",

      // Custom Categories (Employer)
      custom_categories_badge: "కస్టమ్ ఉద్యోగ విభాగాలు",
      custom_categories_title: "యజమాని కస్టమ్ ఉద్యోగ విభాగాలు",
      custom_categories_desc: "మీ సంస్థకు అనుకూలమైన ప్రత్యేక ఉద్యోగ విభాగాలను నిర్వచించండి. ఇవి మీ పోస్టింగ్‌లు మరియు ఫిల్టర్‌లలో స్వయంచాలకంగా కనిపిస్తాయి.",
      post_job_opening: "ఉద్యోగం పోస్ట్ చేయండి",
      add_new_category_label: "+ కొత్త విభాగాన్ని జోడించండి",
      add_new_category_ph: "ఉదా: డ్రోన్ ఏవియేషన్, మెరైన్ లాజిస్టిక్స్, సోలార్ ఎనర్జీ...",
      add_category_btn: "విభాగాన్ని జోడించండి",
      saved_categories_note: "సేవ్ చేసిన విభాగాలు వెంటనే మీ పోస్టింగ్ ఫారమ్ మరియు ఫిల్టర్‌లలో అందుబాటులోకి వస్తాయి.",
      active_custom_categories: "మీ యాక్టివ్ కస్టమ్ విభాగాలు",

      // Worker Desk
      verified_professional: "ధృవీకరించబడిన నిపుణుడు",
      worker_desk_title: "వర్కర్ డెస్క్",
      worker_desk_desc: "యజమాని సమీక్ష స్థితిని ట్రాక్ చేయండి, మీ అర్హతలను నవీకరించండి మరియు ప్రాధాన్యత ప్లేస్‌మెంట్‌ను నిర్వహించండి.",
      find_more_jobs: "మరిన్ని ఉద్యోగాలు వెతకండి →",
      stat_applications: "దరఖాస్తులు",
      stat_applications_sub: "ప్రత్యక్ష దరఖాస్తులు",
      stat_shortlisted: "షార్ట్‌లిస్ట్ అయ్యారు",
      stat_shortlisted_sub: "కాల్ చేయడానికి సిద్ధమవుతున్నారు",
      stat_placement: "ప్లేస్‌మెంట్",
      stat_placement_active: "యాక్టివ్",
      stat_placement_sub: "క్యూలలో ఫీచర్ చేయబడింది",
      my_submitted_apps_title: "నా సమర్పించిన దరఖాస్తులు",
      my_submitted_apps_sub: "ధృవీకరించబడిన యజమానుల నుండి రియల్ టైమ్ అప్‌డేట్స్",
      trade_profile_details_title: "వృత్తి ప్రొఫైల్ వివరాలు",
      trade_profile_details_sub: "దరఖాస్తులను సమీక్షించేటప్పుడు ధృవీకరించబడిన యజమానులకు కనిపిస్తుంది",
      technical_credentials: "సాంకేతిక అర్హతలు",
      verified_skill_certified: "ధృవీకరించబడిన నైపుణ్యాలు",
      profile_strength: "ప్రొఫైల్ బలం:",
      legal_name: "పూర్తి చట్టపరమైన పేరు",
      discipline_skills: "ప్రధాన విభాగం & నైపుణ్యాలు",
      total_tech_exp: "మొత్తం సాంకేతిక అనుభవం",
      edu_qualifications: "విద్య & అర్హతలు",
      employer_label: "యజమాని:",
      applied_label: "దరఖాస్తు తేది:",
      experience_on_file: "నమోదైన అనుభవం",
      workplace_shared: "పని ప్రదేశం భాగస్వామ్యం చేయబడింది",
      maps: "మ్యాప్స్",
      boost_app: "యాప్ బూస్ట్ చేయండి (₹149)",
      boosted: "బూస్ట్ చేయబడింది",
      withdraw: "ఉపసంహరించుకోండి",

      // Job Badges & Listing
      verified_employer: "ధృవీకరించబడిన సంస్థ",
      your_vacancy: "మీ ఉద్యోగం",
      per_month: "నెలకు",
      apply_now: "దరఖాస్తు చేసుకోండి",
      apply_instant: "వెంటనే దరఖాస్తు చేయండి",
      applied: "దరఖాస్తు చేసారు",
      view_spec: "వివరాలు చూడండి",

      // Modal Listing Translation
      translate_to_te: "తెలుగులో చదవండి",
      translate_to_hi: "हिन्दी में पढ़ें",
      show_original_en: "↺ ఇంగ్లీష్ చూడండి",
      translating: "అనువదిస్తోంది..."
    },

    hi: {
      lang_switch_title: "भाषा",
      lang_name_en: "अंग्रेजी",
      lang_name_te: "तेलुगु",
      lang_name_hi: "हिन्दी",

      // Top Navigation
      nav_find_jobs: "नौकरियां खोजें",
      nav_listed_jobs: "नौकरियां",
      nav_candidates: "उम्मीदवार",
      nav_worker_desk: "कामगार डेस्क",
      nav_employer_workspace: "नियोक्ता डेस्क",
      nav_post_job: "+ नौकरी पोस्ट करें",
      nav_signin: "साइन इन",
      nav_get_started: "शुरू करें →",
      nav_signout: "लॉग आउट",
      nav_my_profile: "मेरी प्रोफ़ाइल",
      nav_vacancies: "रिक्तियां",
      nav_approach: "दृष्टिकोण",
      nav_pricing: "मूल्य निर्धारण",

      // Home Hero & Platform
      hero_line_1: "सत्यापित सॉफ्टवेयर, क्यूए और इंजीनियरिंग प्रतिभा के लिए भारत का डायरेक्ट नेटवर्क",
      hero_line_2: "& उच्च-प्रभाव वाली तकनीकी टीमें — सीधी सत्यापित भर्ती",
      hero_city: "[ विशाखापत्तनम ]",
      ios_caption: "विशाखापत्तनम टेक नेटवर्क",
      ios_large_title: "नौकरी रिक्तियां",
      ios_subhead: "सीधा बैंक वेतन • प्रमाणित ट्रेड पास",
      ios_search_ph: "पद, कौशल या टेक स्टैक खोजें...",
      ios_tab_jobs: "नौकरियां खोजें",
      ios_tab_hire: "प्रतिभा नियुक्त करें",
      ios_trust_1: "सीधा बैंक पेरोल",
      ios_trust_2: "सीधी नियोक्ता भर्ती",
      ios_trust_3: "विजाग आईटी कॉरिडोर",

      platform_approach_tag: "प्लेटफॉर्म दृष्टिकोण",
      platform_approach_title: "सॉफ्टवेयर इंजीनियरों, क्यूए परीक्षकों और तकनीकी लीडर्स को सत्यापित नियोक्ताओं से जोड़ने वाला सीधा नेटवर्क।",
      platform_approach_desc: "सॉफ्टवेयर इंजीनियरों, क्यूए परीक्षकों और तकनीकी लीडर्स को सत्यापित नियोक्ताओं से जोड़ने वाला सीधा नेटवर्क।",
      start_direct_hiring: "सीधी भर्ती शुरू करें",
      open_positions_tag: "खुली रिक्तियां",
      featured_vacancies_title: "प्रमुख नौकरियां",
      see_all_jobs: "सभी नौकरियां देखें",
      filter_all: "सभी",

      // Pricing Section
      pricing_tag: "पारदर्शी मूल्य निर्धारण",
      pricing_free_pill: "उम्मीदवारों के लिए 100% मुफ़्त",
      pricing_title: "शून्य एजेंसी कमीशन के साथ सरल पे-पर-अनलॉक भर्ती",
      pricing_subtitle: "मासिक सब्सक्रिप्शन के बिना सत्यापित व्हाट्सएप और फोन के माध्यम से सीधे इंजीनियरों से संपर्क करें।",
      starter_pack_title: "स्टार्टर पैक",
      starter_pack_period: "/ एकल अनलॉक",
      starter_pack_desc: "एकल तकनीकी विशेषज्ञ की तत्काल भर्ती के लिए आदर्श पैक।",
      get_starter_pack: "स्टार्टर पैक लें",
      growth_bundle_title: "ग्रोथ बंडल",
      growth_bundle_period: "/ 5 अनलॉक (₹49/प्रत्येक)",
      growth_bundle_desc: "तेजी से भर्ती करने वाली इंजीनियरिंग टीमों के लिए सर्वोत्तम पैक।",
      get_growth_bundle: "ग्रोथ बंडल लें",

      // Candidates Directory
      talent_candidates_dir_badge: "प्रतिभा और उम्मीदवार डायरेक्टरी",
      verified_candidates_directory: "सत्यापित उम्मीदवार डायरेक्टरी",
      candidates_subhead: "कौशल-सत्यापित पास वाले प्रमाणित सॉफ्टवेयर डेवलपर्स, क्यूए लीड्स और आर्किटेक्ट्स देखें।",
      selected_btn: "चयनित",
      unlock_credits_btn: "अनलॉक क्रेडिट खरीदें",
      showing_verified_cands: "सत्यापित उम्मीदवार प्रदर्शित",
      verified_cand_profiles: "100% सत्यापित उम्मीदवार प्रोफ़ाइल",
      match_label: "मैच:",
      sort_best_match: "क्रमबद्ध करें: सर्वश्रेष्ठ मैच % (अनुशंसित)",
      sort_exp_high_low: "क्रमबद्ध करें: अनुभव (उच्च से निम्न)",
      sort_recently_added: "क्रमबद्ध करें: हाल ही में जोड़े गए",
      yrs_exp: "वर्ष अनुभव",
      match: "मैच",
      verified_candidate: "सत्यापित उम्मीदवार",
      shielded_phone: "सुरक्षित फ़ोन:",
      direct_phone: "सीधा फ़ोन:",
      select_candidate: "+ उम्मीदवार चुनें",
      selected: "चयनित",
      in_workspace: "✓ कार्यक्षेत्र में मौजूद",

      // Search & Filters
      search_vacancies_title: "रिक्तियां खोजें",
      search_vacancies_ph: "पद, मशीन, कौशल...",
      search_candidates_title: "उम्मीदवार खोजें",
      search_candidates_ph: "नाम, ट्रेड, कौशल...",
      category_specialization_title: "नौकरी श्रेणी और विशेषज्ञता",
      all_specializations: "सभी विशेषज्ञताएं",
      your_vacancy_posts: "आपकी नौकरी पोस्ट",
      see_more: "+ और देखें",
      see_less: "कम देखें",
      location_hub_title: "स्थान / शहर",
      all_locations: "सभी स्थान (विशाखापत्तनम)",
      min_salary_title: "न्यूनतम वेतन",
      all_pay_scales: "सभी वेतनमान",
      total_experience_title: "कुल अनुभव",
      all_exp_levels: "सभी अनुभव स्तर",
      reset_all_filters: "सभी फ़िल्टर रीसेट करें",
      show_results: "परिणाम देखें",
      sort_by: "क्रमबद्ध करें",

      // Employer Workspace
      verified_hiring_business: "सत्यापित नियोक्ता व्यापार",
      edit_profile: "प्रोफ़ाइल संपादित करें",
      employer_desk_title: "नियोक्ता डेस्क",
      employer_desk_desc: "उम्मीदवारों की प्रोफ़ाइल की समीक्षा करें और पूरे भारत के प्रमाणित इंजीनियरों के सीधे संपर्क विवरण अनलॉक करें।",
      post_new_vacancy: "+ नई रिक्ति पोस्ट करें",
      browse_candidates: "उम्मीदवार देखें →",
      buy_unlock_credits: "अनलॉक क्रेडिट खरीदें",
      stat_received_apps: "प्राप्त आवेदन",
      stat_received_apps_sub: "आपकी नौकरियों के लिए आवेदन करने वाले",
      stat_unlocked_contacts: "अनलॉक किए गए संपर्क",
      stat_unlocked_contacts_sub: "कॉलिंग के लिए तैयार नंबर",
      stat_unlock_balance: "अनलॉक बैलेंस",
      stat_unlock_balance_sub: "खाते में शेष क्रेडिट",
      received_cands_title: "प्राप्त उम्मीदवार आवेदन",
      received_cands_subtitle: "गोपनीयता-सुरक्षित सूची। सीधे फोन और व्हाट्सएप बातचीत शुरू करने के लिए 1 क्रेडिट से संपर्क अनलॉक करें।",
      selection_cart_badge: "चयन कार्ट",
      cands_in_cart: "चयन कार्ट में उम्मीदवार",
      cart_subtext: "(विवरण देखें या 1 क्लिक में अनलॉक करें)",
      clear_cart: "कार्ट साफ़ करें",
      unlock_selected: "चयनित अनलॉक करें",
      years_experience: "वर्षों का अनुभव",
      for_role: "पद:",
      contact_unlocked: "संपर्क अनलॉक किया गया",
      contact_shielded: "संपर्क सुरक्षित",
      unlocked: "अनलॉक किया गया",
      in_cart: "कार्ट में है",
      added_label: "जोड़ा गया:",
      pass_details: "पास विवरण →",
      call_direct: "सीधे कॉल करें",
      unlock_credit: "अनलॉक करें (1 क्रेडिट)",

      // Custom Categories (Employer)
      custom_categories_badge: "कस्टम नौकरी विशेषज्ञताएं",
      custom_categories_title: "नियोक्ता कस्टम नौकरी श्रेणियां",
      custom_categories_desc: "अपने संगठन के अनुसार विशेष नौकरी श्रेणियां बनाएं। ये आपकी रिक्तियों और फ़िल्टरों में स्वचालित रूप से सिंक हो जाएंगी।",
      post_job_opening: "नौकरी पोस्ट करें",
      add_new_category_label: "+ नई कस्टम श्रेणी जोड़ें",
      add_new_category_ph: "उदा: ड्रोन एविएशन, समुद्री लॉजिस्टिक्स, सोलर ऊर्जा...",
      add_category_btn: "श्रेणी जोड़ें",
      saved_categories_note: "सहेजी गई श्रेणियां तुरंत आपके नौकरी पोस्टिंग फ़ॉर्म और फ़िल्टर मेनू में उपलब्ध होंगी।",
      active_custom_categories: "आपकी सक्रिय कस्टम श्रेणियां",

      // Worker Desk
      verified_professional: "सत्यापित पेशेवर",
      worker_desk_title: "कामगार डेस्क",
      worker_desk_desc: "नियोक्ता समीक्षा स्थिति को ट्रैक करें, अपनी योग्यताओं को अपडेट करें और प्राथमिकता प्लेसमेंट प्रबंधित करें।",
      find_more_jobs: "और नौकरियां खोजें →",
      stat_applications: "आवेदन",
      stat_applications_sub: "सीधे आवेदन",
      stat_shortlisted: "शॉर्टलिस्टेड",
      stat_shortlisted_sub: "कॉल की तैयारी",
      stat_placement: "प्लेसमेंट",
      stat_placement_active: "सक्रिय",
      stat_placement_sub: "कतारों में फ़ीचर",
      my_submitted_apps_title: "मेरे जमा किए गए आवेदन",
      my_submitted_apps_sub: "सत्यापित नियोक्ताओं से रियल-टाइम स्थिति अपडेट",
      trade_profile_details_title: "ट्रेड प्रोफ़ाइल विवरण",
      trade_profile_details_sub: "आवेदन समीक्षा के दौरान सत्यापित नियोक्ताओं को दिखाई देता है",
      technical_credentials: "तकनीकी साख",
      verified_skill_certified: "सत्यापित और कौशल प्रमाणित",
      profile_strength: "प्रोफ़ाइल ताकत:",
      legal_name: "पूरा कानूनी नाम",
      discipline_skills: "प्राथमिक अनुशासन और कौशल",
      total_tech_exp: "कुल तकनीकी अनुभव",
      edu_qualifications: "शिक्षा और योग्यताएं",
      employer_label: "नियोक्ता:",
      applied_label: "आवेदन तिथि:",
      experience_on_file: "फ़ाइल पर अनुभव",
      workplace_shared: "कार्यस्थल साझा किया गया",
      maps: "मैप्स",
      boost_app: "आवेदन बूस्ट करें (₹149)",
      boosted: "बूस्ट किया गया",
      withdraw: "वापस लें",

      // Job Badges & Listing
      verified_employer: "सत्यापित नियोक्ता",
      your_vacancy: "आपकी रिक्ति",
      per_month: "माह",
      apply_now: "आवेदन करें",
      apply_instant: "तुरंत आवेदन करें",
      applied: "आवेदित",
      view_spec: "विवरण देखें",

      // Modal Listing Translation
      translate_to_te: "తెలుగులో చదవండి",
      translate_to_hi: "हिन्दी में पढ़ें",
      show_original_en: "↺ अंग्रेजी देखें",
      translating: "अनुवाद हो रहा है..."
    }
  };

  var CATEGORY_MAP = {
    // Software & Engineering
    "software engineering": { te: "సాఫ్ట్‌వేర్ ఇంజనీరింగ్", hi: "सॉफ्टवेयर इंजीनियरिंग" },
    "qa & testing": { te: "క్యూఏ & టెస్టింగ్", hi: "क्यूए और टेस्टिंग" },
    "team leadership": { te: "టీమ్ లీడర్‌షిప్", hi: "टीम लीडरशिप" },
    "devops & cloud": { te: "డెవ్‌ఆప్స్ & క్లౌడ్", hi: "डेवऑप्स और क्लाउड" },
    "cloud & devops": { te: "డెవ్‌ఆప్స్ & క్లౌడ్", hi: "डेवऑप्स और क्लाउड" },
    "mobile development": { te: "మొబైల్ డెవలప్‌మెంట్", hi: "मोबाइल डेवलपमेंट" },
    "data & ai": { te: "డేటా & ఏఐ", hi: "डेटा और एआई" },
    "data & analytics": { te: "డేటా & ఎనలిటిక్స్", hi: "डेटा और एनालिटिक्स" },
    "cybersecurity": { te: "సైబర్ సెక్యూరిటీ", hi: "साइबर सुरक्षा" },
    "product & design": { te: "ప్రొడక్ట్ & డిజైన్", hi: "उत्पाद और डिज़ाइन" },
    "human resources": { te: "హ్యూమన్ రిసోర్సెస్ (HR)", hi: "मानव संसाधन (HR)" },
    "talent & operations": { te: "టాలెంట్ & ఆపరేషన్స్", hi: "टैलेंट और ऑपरेशंस" },
    "it & systems": { te: "ఐటీ & సిస్టమ్స్", hi: "आईटी और सिस्टम" },

    // Candidates Directory specific titles used as categories
    "cloud & devops infrastructure engineer": { te: "క్లౌడ్ & డెవ్‌ఆప్స్ ఇంజనీర్", hi: "क्लाउड और डेवऑप्स इंजीनियर" },
    "full-stack developer": { te: "ఫుల్-స్టాక్ డెవలపర్", hi: "फुल-स्टैक डेवलपर" },
    "senior full-stack engineer": { te: "సీనియర్ ఫుల్-స్టాక్ ఇంజనీర్", hi: "सीनियर फुल-स्टैक इंजीनियर" },
    "lead mobile app developer (ios & android)": { te: "లీడ్ మొబైల్ యాప్ డెవలపర్", hi: "लीड मोबाइल ऐप डेवलपर" },
    "lead mobile app developer": { te: "లీడ్ మొబైల్ యాప్ డెవలపర్", hi: "लीड मोबाइल ऐप डेवलपर" },
    "senior technical recruiter & hr operations partner": { te: "సీనియర్ టెక్ రిక్రూటర్ & HR పార్టనర్", hi: "सीनियर टेक्निकल रिक्रूटर और HR" },
    "senior technical recruiter": { te: "సీనియర్ టెక్ రిక్రూటర్", hi: "सीनियर टेक्निकल रिक्रूटर" },
    "technical team leader & system architect": { te: "టెక్నికల్ టీమ్ లీడర్ & సిస్టమ్ ఆర్కిటెక్ట్", hi: "तकनीकी टीम लीडर और सिस्टम आर्किटेक्ट" },
    "technical team leader": { te: "టెక్నికల్ టీమ్ లీడర్", hi: "तकनीकी टीम लीडर" },
    "ai / machine learning engineer": { te: "ఏఐ / మెషిన్ లెర్నింగ్ ఇంజనీర్", hi: "एआई और मशीन लर्निंग इंजीनियर" },
    "senior java architect": { te: "సీనియర్ జావా ఆర్కిటెక్ట్", hi: "सीनियर जावा आर्किटेक्ट" },
    "registered staff nurse": { te: "రిజిస్టర్డ్ స్టాఫ్ నర్స్", hi: "स्टाफ नर्स" },

    // Non-tech / trades
    "driver": { te: "డ్రైవర్", hi: "ड्राइवर" },
    "driver / logistics": { te: "డ్రైవర్ / రవాణా", hi: "ड्राइवर / लॉजिस्टिक्स" },
    "electrician": { te: "ఎలక్ట్రీషియన్", hi: "इलेक्ट्रीशियन" },
    "cook": { te: "వంట మాస్టర్", hi: "रसोइया" },
    "mechanic": { te: "మెకానిక్", hi: "मैकेनिक" },
    "security": { te: "సెక్యూరిటీ", hi: "सुरक्षा गार्ड" },
    "plumber": { te: "ప్లంబర్", hi: "प्लम्बर" },
    "carpenter": { te: "వడ్రంగి", hi: "बढ़ई" },
    "tailor": { te: "టైలర్", hi: "दर्जी" },
    "welder": { te: "వెల్డర్", hi: "वेल्डर" },
    "painter": { te: "పెయింటర్", hi: "पेंटर" }
  };

  var ROLE_MAP = {
    "senior java architect": { te: "సీనియర్ జావా ఆర్కిటెక్ట్", hi: "सीनियर जावा आर्किटेक्ट" },
    "technical team leader & system architect": { te: "టెక్నికల్ టీమ్ లీడర్ & సిస్టమ్ ఆర్కిటెక్ట్", hi: "तकनीकी टीम लीडर और सिस्टम आर्किटेक्ट" },
    "technical team leader": { te: "టెక్నికల్ టీమ్ లీడర్", hi: "तकनीकी टीम लीडर" },
    "senior technical recruiter & hr operations partner": { te: "సీనియర్ టెక్ రిక్రూటర్ & HR పార్టనర్", hi: "सीनियर टेक्निकल रिक्रूटर और HR पार्टनर" },
    "senior full-stack engineer": { te: "సీనియర్ ఫుల్-స్టాక్ ఇంజనీర్", hi: "सीनियर फुल-स्टैक इंजीनियर" },
    "full-stack react & node engineer": { te: "ఫుల్-స్టాక్ రియాక్ట్ & నోడ్ ఇంజనీర్", hi: "फुल-स्टैक रिएक्ट और नोड इंजीनियर" },
    "full-stack developer": { te: "ఫుల్-స్టాక్ డెవలపర్", hi: "फुल-स्टैक डेवलपर" },
    "cloud & devops infrastructure engineer": { te: "క్లౌడ్ & డెవ్‌ఆప్స్ ఇన్ఫ్రాస్ట్రక్చర్ ఇంజనీర్", hi: "क्लाउड और डेवऑप्स इंफ्रास्ट्रक्चर इंजीनियर" },
    "lead mobile app developer (react native & flutter)": { te: "లీడ్ మొబైల్ డెవలపర్ (రియాక్ట్ నేటివ్ & ఫ్లట్టర్)", hi: "लीड मोबाइल डेवलपर (रिएक्ट नेटिव और फ़्लटर)" },
    "lead mobile app developer (ios & android)": { te: "లీడ్ మొబైల్ యాప్ డెవలపర్ (iOS & Android)", hi: "लीड मोबाइल ऐप डेवलपर (iOS और Android)" },
    "ai / machine learning engineer": { te: "ఏఐ / మెషిన్ లెర్నింగ్ ఇంజనీర్", hi: "एआई और मशीन लर्निंग इंजीनियर" },
    "qa automation & performance test engineer": { te: "క్యూఏ ఆటోమేషన్ & పెర్ఫార్మెన్స్ టెస్ట్ ఇంజనీర్", hi: "क्यूए ऑटोमेशन और परफॉर्मेंस टेस्ट इंजीनियर" },
    "registered staff nurse": { te: "రిజిస్టర్డ్ స్టాఫ్ నర్స్", hi: "स्टाफ नर्स" },
    "technical professional": { te: "సాంకేతిక నిపుణుడు", hi: "तकनीकी पेशेवर" },
    "technical specialist": { te: "సాంకేతిక నిపుణుడు", hi: "तकनीकी विशेषज्ञ" }
  };

  function getStoredLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.indexOf(saved) !== -1) return saved;
      var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (nav.indexOf('te') === 0) return 'te';
      if (nav.indexOf('hi') === 0) return 'hi';
    } catch(e) {}
    return DEFAULT_LANG;
  }

  function setLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch(e) {}

    document.documentElement.setAttribute('lang', lang);

    // Update text elements with data-i18n
    var textEls = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textEls.length; i++) {
      var el = textEls[i];
      var key = el.getAttribute('data-i18n');
      var val = DICTIONARY[lang] && DICTIONARY[lang][key];
      if (val) {
        el.textContent = val;
      }
    }

    // Update placeholders with data-i18n-ph
    var phEls = document.querySelectorAll('[data-i18n-ph]');
    for (var j = 0; j < phEls.length; j++) {
      var pEl = phEls[j];
      var pKey = pEl.getAttribute('data-i18n-ph');
      var pVal = DICTIONARY[lang] && DICTIONARY[lang][pKey];
      if (pVal) {
        pEl.placeholder = pVal;
      }
    }

    // Update tooltips with data-i18n-title
    var tEls = document.querySelectorAll('[data-i18n-title]');
    for (var k = 0; k < tEls.length; k++) {
      var tEl = tEls[k];
      var tKey = tEl.getAttribute('data-i18n-title');
      var tVal = DICTIONARY[lang] && DICTIONARY[lang][tKey];
      if (tVal) {
        tEl.title = tVal;
      }
    }

    // Update selector buttons state
    updateSelectorUI(lang);

    // Dispatch event so dynamic scripts (jobs grid, candidate cards, etc.) can re-render
    try {
      window.dispatchEvent(new CustomEvent('jobway:language-change', { detail: { lang: lang } }));
    } catch(e) {}
  }

  function updateSelectorUI(lang) {
    // 1. Desktop dropdown label
    var labelEl = document.getElementById('current-lang-label');
    if (labelEl) {
      if (lang === 'te') labelEl.textContent = 'తెలుగు';
      else if (lang === 'hi') labelEl.textContent = 'हिन्दी';
      else labelEl.textContent = 'English';
    }

    // 2. Desktop dropdown options active state
    var options = document.querySelectorAll('.lang-option');
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    }

    // 3. Mobile segmented buttons active state
    var segBtns = document.querySelectorAll('.segmented-btn[data-lang]');
    for (var j = 0; j < segBtns.length; j++) {
      var btn = segBtns[j];
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  }

  function t(key, fallback) {
    var lang = getStoredLang();
    if (DICTIONARY[lang] && DICTIONARY[lang][key]) {
      return DICTIONARY[lang][key];
    }
    if (DICTIONARY[DEFAULT_LANG] && DICTIONARY[DEFAULT_LANG][key]) {
      return DICTIONARY[DEFAULT_LANG][key];
    }
    return fallback !== undefined ? fallback : key;
  }

  function translateCategory(rawCat) {
    var lang = getStoredLang();
    if (lang === 'en' || !rawCat) return rawCat;
    var norm = String(rawCat).toLowerCase().trim();
    if (CATEGORY_MAP[norm] && CATEGORY_MAP[norm][lang]) {
      return CATEGORY_MAP[norm][lang];
    }
    // Partial substring match
    for (var k in CATEGORY_MAP) {
      if (norm.indexOf(k) !== -1 || k.indexOf(norm) !== -1) {
        if (CATEGORY_MAP[k][lang]) return CATEGORY_MAP[k][lang];
      }
    }
    return rawCat;
  }

  function translateRole(rawRole) {
    var lang = getStoredLang();
    if (lang === 'en' || !rawRole) return rawRole;
    var norm = String(rawRole).toLowerCase().trim();
    if (ROLE_MAP[norm] && ROLE_MAP[norm][lang]) {
      return ROLE_MAP[norm][lang];
    }
    if (CATEGORY_MAP[norm] && CATEGORY_MAP[norm][lang]) {
      return CATEGORY_MAP[norm][lang];
    }
    for (var k in ROLE_MAP) {
      if (norm.indexOf(k) !== -1 || k.indexOf(norm) !== -1) {
        if (ROLE_MAP[k][lang]) return ROLE_MAP[k][lang];
      }
    }
    return rawRole;
  }

  function initUIListeners() {
    // Toggle desktop dropdown
    var toggleBtn = document.getElementById('btn-lang-toggle');
    var menu = document.getElementById('lang-dropdown-menu');
    if (toggleBtn && menu) {
      toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = menu.classList.contains('active');
        if (isOpen) {
          menu.classList.remove('active');
          toggleBtn.setAttribute('aria-expanded', 'false');
        } else {
          menu.classList.add('active');
          toggleBtn.setAttribute('aria-expanded', 'true');
        }
      });

      document.addEventListener('click', function(e) {
        if (!e.target.closest('#lang-selector-desktop')) {
          menu.classList.remove('active');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Dropdown option clicks
    var options = document.querySelectorAll('.lang-option');
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener('click', function(e) {
        var chosen = this.getAttribute('data-lang');
        if (chosen) {
          setLanguage(chosen);
          if (menu) menu.classList.remove('active');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Mobile segmented button clicks
    var segBtns = document.querySelectorAll('.segmented-btn[data-lang]');
    for (var j = 0; j < segBtns.length; j++) {
      segBtns[j].addEventListener('click', function(e) {
        var chosen = this.getAttribute('data-lang');
        if (chosen) {
          setLanguage(chosen);
        }
      });
    }
  }

  // Export to global window
  window.jobwayI18n = {
    setLanguage: setLanguage,
    getCurrentLanguage: getStoredLang,
    t: t,
    translateCategory: translateCategory,
    translateRole: translateRole,
    dictionary: DICTIONARY
  };
  window.setLanguage = setLanguage;
  window.t = t;
  window.translateCategory = translateCategory;
  window.translateRole = translateRole;

  // Auto-init on script load and DOMContentLoaded
  var currentLang = getStoredLang();
  document.documentElement.setAttribute('lang', currentLang);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initUIListeners();
      setLanguage(getStoredLang());
    });
  } else {
    initUIListeners();
    setLanguage(currentLang);
  }

})(window);
