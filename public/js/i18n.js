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

      // Banner & Hero
      careers_directory_badge: "Careers & Skilled Trades Directory",
      verified_job_vacancies: "Verified Job Vacancies",
      post_vacancy_btn: "Post Vacancy",
      browse_candidates_btn: "Browse Candidates",
      worker_desk_applications: "Worker Desk & Applications →",
      signin_to_apply_hire: "Sign In to Apply or Hire →",
      direct_verified_hiring: "direct verified hiring",
      candidate_directory_badge: "Verified Candidate Directory",
      candidate_directory_title: "Skilled Engineers & Tech Talent",

      // Filters & Search
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

      // Badges & Action Buttons
      apply_now: "Apply Now",
      apply_instant: "Apply Instant",
      applied: "Applied",
      withdraw: "Withdraw",
      boost_app: "Boost App (₹149)",
      unlock_contact: "Unlock Contact",
      contact_unlocked: "Contact Unlocked",
      call_direct: "Call Direct",
      open_maps: "Open Google Maps",
      workplace_location_shared: "WORKPLACE LOCATION SHARED",
      verified_hiring_business: "Verified Hiring Business",
      verified_candidate: "Verified Candidate",
      unlocked: "UNLOCKED",
      yrs_exp: "Yrs Exp",
      experience_on_file: "Experience on file",
      select_candidate: "+ Select Candidate",
      selected: "Selected",
      in_workspace: "✓ In Workspace",
      direct_contact: "Direct Contact:",
      shielded_phone: "Shielded Phone:",

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

      // Banner & Hero
      careers_directory_badge: "కెరీర్స్ & నైపుణ్య ఉద్యోగాల డైరెక్టరీ",
      verified_job_vacancies: "ధృవీకరించబడిన ఉద్యోగ ఖాళీలు",
      post_vacancy_btn: "ఉద్యోగం వేయండి",
      browse_candidates_btn: "అభ్యర్థులను చూడండి",
      worker_desk_applications: "వర్కర్ డెస్క్ & దరఖాస్తులు →",
      signin_to_apply_hire: "దరఖాస్తు లేదా నియామకం కోసం సైన్ ఇన్ అవ్వండి →",
      direct_verified_hiring: "ప్రత్యక్ష ధృవీకరించబడిన నియామకం",
      candidate_directory_badge: "ధృవీకరించబడిన అభ్యర్థుల డైరెక్టరీ",
      candidate_directory_title: "నైపుణ్యం కలిగిన ఇంజనీర్లు & ప్రతిభ",

      // Filters & Search
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

      // Badges & Action Buttons
      apply_now: "దరఖాస్తు చేసుకోండి",
      apply_instant: "వెంటనే దరఖాస్తు చేయండి",
      applied: "దరఖాస్తు చేసారు",
      withdraw: "ఉపసంహరించుకోండి",
      boost_app: "యాప్ బూస్ట్ చేయండి (₹149)",
      unlock_contact: "వివరాలు అన్‌లాక్ చేయండి",
      contact_unlocked: "వివరాలు అన్‌లాక్ చేయబడ్డాయి",
      call_direct: "నేరుగా కాల్ చేయండి",
      open_maps: "గూగుల్ మ్యాప్స్‌లో తెరవండి",
      workplace_location_shared: "పని ప్రదేశ వివరాలు భాగస్వామ్యం చేయబడ్డాయి",
      verified_hiring_business: "ధృవీకరించబడిన సంస్థ",
      verified_candidate: "ధృవీకరించబడిన అభ్యర్థి",
      unlocked: "అన్‌లాక్ చేయబడింది",
      yrs_exp: "సం. అనుభవం",
      experience_on_file: "నమోదైన అనుభవం",
      select_candidate: "+ అభ్యర్థిని ఎంచుకోండి",
      selected: "ఎంచుకోబడింది",
      in_workspace: "✓ వర్క్‌స్పేస్‌లో ఉంది",
      direct_contact: "ప్రత్యక్ష నంబర్:",
      shielded_phone: "రక్షిత ఫోన్ నంబర్:",

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

      // Banner & Hero
      careers_directory_badge: "करियर और कुशल ट्रेड डायरेक्टरी",
      verified_job_vacancies: "सत्यापित नौकरी रिक्तियां",
      post_vacancy_btn: "रिक्ति पोस्ट करें",
      browse_candidates_btn: "उम्मीदवार देखें",
      worker_desk_applications: "कामगार डेस्क और आवेदन →",
      signin_to_apply_hire: "आवेदन या भर्ती के लिए साइन इन करें →",
      direct_verified_hiring: "सीधी सत्यापित भर्ती",
      candidate_directory_badge: "सत्यापित उम्मीदवार डायरेक्टरी",
      candidate_directory_title: "कुशल इंजीनियर और तकनीकी प्रतिभा",

      // Filters & Search
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

      // Badges & Action Buttons
      apply_now: "आवेदन करें",
      apply_instant: "तुरंत आवेदन करें",
      applied: "आवेदित",
      withdraw: "वापस लें",
      boost_app: "आवेदन बूस्ट करें (₹149)",
      unlock_contact: "संपर्क विवरण अनलॉक करें",
      contact_unlocked: "संपर्क अनलॉक किया गया",
      call_direct: "सीधे कॉल करें",
      open_maps: "गूगल मैप्स में खोलें",
      workplace_location_shared: "कार्यस्थल स्थान साझा किया गया",
      verified_hiring_business: "सत्यापित नियोक्ता",
      verified_candidate: "सत्यापित उम्मीदवार",
      unlocked: "अनलॉक किया गया",
      yrs_exp: "वर्ष अनुभव",
      experience_on_file: "फ़ाइल पर अनुभव",
      select_candidate: "+ उम्मीदवार चुनें",
      selected: "चयनित",
      in_workspace: "✓ कार्यक्षेत्र में मौजूद",
      direct_contact: "सीधा संपर्क:",
      shielded_phone: "सुरक्षित फ़ोन:",

      // Modal Listing Translation
      translate_to_te: "తెలుగులో చదవండి",
      translate_to_hi: "हिन्दी में पढ़ें",
      show_original_en: "↺ अंग्रेजी देखें",
      translating: "अनुवाद हो रहा है..."
    }
  };

  var CATEGORY_MAP = {
    "software engineering": { te: "సాఫ్ట్‌వేర్ ఇంజనీరింగ్", hi: "सॉफ्टवेयर इंजीनियरिंग" },
    "qa & testing": { te: "క్యూఏ & టెస్టింగ్", hi: "क्यूए और टेस्टिंग" },
    "team leadership": { te: "టీమ్ లీడర్‌షిప్", hi: "टीम लीडरशिप" },
    "devops & cloud": { te: "డెవ్‌ఆప్స్ & క్లౌడ్", hi: "डेवऑप्स और क्लाउड" },
    "data & analytics": { te: "డేటా & ఎనలిటిక్స్", hi: "डेटा और एनालिटिक्स" },
    "registered staff nurse": { te: "రిజిస్టర్డ్ స్టాఫ్ నర్స్", hi: "स्टाफ नर्स" },
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
    var norm = rawCat.toLowerCase().trim();
    if (CATEGORY_MAP[norm] && CATEGORY_MAP[norm][lang]) {
      return CATEGORY_MAP[norm][lang];
    }
    return rawCat;
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
    dictionary: DICTIONARY
  };
  window.setLanguage = setLanguage;
  window.t = t;
  window.translateCategory = translateCategory;

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
