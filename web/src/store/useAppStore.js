import { create } from 'zustand';

const TRANSLATIONS = {
    en: {
        home: 'Home',
        dashboard: 'Dashboard',
        cropAdvisor: 'Crop Advisor',
        pestAnalyzer: 'Pest Analyzer',
        yieldPredictor: 'Yield Predictor',
        marketPrices: 'Market Prices',
        settings: 'Settings',
        welcome: 'Jai Kisan! 🌾',
        subtitle: "Your smart farm assistant",
        weather: 'Today\'s Weather',
        marketTrend: 'Market Trends',
        getSoilAdvice: 'Get Soil Advice',
        analyzePest: 'Analyze Pest',
        viewPrices: 'View Prices',
        noData: 'No data available',
        loading: 'Loading...',
        soilType: 'Soil Type',
        nitrogen: 'Nitrogen (N)',
        phosphorus: 'Phosphorus (P)',
        potassium: 'Potassium (K)',
        recommend: 'Get Recommendation',
        uploadImage: 'Upload Leaf Image',
        analyzing: 'Analyzing...',
        diagnosis: 'Diagnosis',
        treatment: 'Treatment Plan',
        commodity: 'Search Commodity',
        search: 'Search',
        language: 'Language',
        voice: 'Voice Input',
    },
    hi: {
        home: 'होम',
        dashboard: 'डैशबोर्ड',
        cropAdvisor: 'फसल सलाहकार',
        pestAnalyzer: 'कीट विश्लेषक',
        yieldPredictor: 'उपज भविष्यवक्ता',
        marketPrices: 'बाजार मूल्य',
        settings: 'सेटिंग्स',
        welcome: 'जय किसान! 🌾',
        subtitle: 'आपका स्मार्ट कृषि सहायक',
        weather: 'आज का मौसम',
        marketTrend: 'बाजार रुझान',
        getSoilAdvice: 'मिट्टी की सलाह लें',
        analyzePest: 'कीट का विश्लेषण करें',
        viewPrices: 'कीमतें देखें',
        noData: 'कोई डेटा उपलब्ध नहीं',
        loading: 'लोड रहा है...',
        soilType: 'मिट्टी का प्रकार',
        nitrogen: 'नाइट्रोजन (N)',
        phosphorus: 'फास्फोरस (P)',
        potassium: 'पोटेशियम (K)',
        recommend: 'सिफारिश प्राप्त करें',
        uploadImage: 'पत्ती की तस्वीर अपलोड करें',
        analyzing: 'विश्लेषण हो रहा है...',
        diagnosis: 'निदान',
        treatment: 'उपचार योजना',
        commodity: 'वस्तु खोजें',
        search: 'खोजें',
        language: 'भाषा',
        voice: 'आवाज इनपुट',
    },
};

const useAppStore = create((set, get) => ({
    language: 'en',
    setLanguage: (lang) => set({ language: lang }),
    t: (key) => {
        const lang = get().language;
        return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key;
    },

    weather: null,
    setWeather: (weather) => set({ weather }),

    cropRecommendation: null,
    setCropRecommendation: (rec) => set({ cropRecommendation: rec }),

    pestResult: null,
    setPestResult: (result) => set({ pestResult: result }),

    trackEvent: async (userId, eventType, metadata = {}) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        try {
            await fetch(`${baseUrl}/api/analytics/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, event_type: eventType, metadata })
            });
        } catch (error) {
            console.error("Analytics tracking failed:", error);
        }
    }
}));

export default useAppStore;
