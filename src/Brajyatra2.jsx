import React, { useState, useEffect } from "react";
import Skjbimg from "./assets/Skjb.jpeg";
import Bbtimg from "./assets/Bbt.jpeg";
import GTimg from "./assets/GT.jpeg";
import Srrtimg from "./assets/Srrt.jpeg";
import MMTimg from "./assets/MMT.jpeg";
import RRTimg from "./assets/RVT.jpeg";
import KSimg from "./assets/KS.jpeg";
import MMimg from "./assets/MM.jpeg";
import Bimg from "./assets/B.jpeg";
import RRimg from "./assets/RR.jpeg";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { auth, db } from "./firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaRoute,
  FaMap,
  FaBrain,
  FaBell,
  FaHeadphones,
  FaCalendarAlt,
  FaStar,
  FaWalking,
  FaTemperatureHigh,
  FaChartLine,
  FaPhoneAlt,
  FaHospital,
  FaShieldAlt,
  FaChevronRight,
  FaChevronDown,
  FaFilter,
  FaHeart,
  FaPizzaSlice,
} from "react-icons/fa";
import "./App.css";
const BrajYatra2 = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [yatraFilters, setYatraFilters] = useState({
    duration: "3-hour",
    crowdTolerance: "medium",
    walkingPreference: "moderate",
  });
  const [userLocation, setUserLocation] = useState(null);
  const [expandedRoute, setExpandedRoute] = useState(null);
  // Firebase Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  const [user, setUser] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    place: "",
    crowdLevel: "",
    comment: "",
  });
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fetch recent feedbacks from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "feedbacks"),
      orderBy("timestamp", "desc"),
      limit(10),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedbacks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentFeedbacks(feedbacks);
    });

    return () => unsubscribe();
  }, []);
  // Mock data for places
  const places = [
    {
      id: 1,
      name: "Shree Krishna Janmabhoomi",
      category: "Famous",
      crowdLevel: "high",
      currentCrowd: 85,
      peakHours: "6-9 AM, 5-8 PM",
      history:
        "Mathura is the holy birthplace of Lord Shri Krishna. Long ago, a cruel king Kansa ruled Mathura. A prophecy said that Devaki’s eighth son would kill him, so Kansa put Devaki and her husband Vasudeva in prison.At midnight, Lord Krishna was born in the prison cell. Miracles happened—the prison doors opened and Vasudeva’s chains broke. He carried baby Krishna across the Yamuna River to Gokul and left him with Yashoda.Years later, Krishna returned to Mathura and killed Kansa, ending his cruelty.Today, the Shri Krishna Janmabhoomi Mandir stands at the exact place of Krishna’s birth and is a symbol of faith and victory of good over evil.",
      significance:
        "One of the most revered temples in Vrindavan, known for its unique deity that stands in a tribhanga pose.",
      whyVisit:
        "Experience the divine darshan and witness the unique ritual where the deity's eyes are covered periodically.",
      image: "🙏  ",
      imageUrl: Skjbimg,
      lat: 27.5799,
      lng: 77.6948,
      distance: 0,
      bestTime: "7-8 AM or 4-5 PM",
      audioStory: "The deity was installed by Swami Haridas in 1864...",
    },
    {
      id: 2,
      name: "Banke Bihari Temple",
      category: "Famous",
      crowdLevel: "medium",
      currentCrowd: 55,
      peakHours: "7-9 PM",
      history:
        "🌸 Story of Banke Bihari MandirIn Vrindavan, the land of divine love, Lord Krishna appeared as Banke Bihari—the charming, playful child of Vrindavan. The idol of Banke Bihari was not carved by human hands; it appeared on its own from the devotion of a great saint, Swami Haridas.Swami Haridas was a deep devotee of Krishna. One day, while singing divine bhajans in Nidhivan, Krishna became so pleased that he appeared in person along with Radha. The saint requested Krishna to stay for the devotees, and Krishna took the beautiful form of Banke Bihari.The idol is special—the eyes are half-closed, full of compassion and playfulness. It is believed that Banke Bihari’s glance is so powerful that the curtain is opened and closed again and again, so devotees are not overwhelmed by divine energy.Even today, Banke Bihari is not worshipped like a god but loved like a child—without bells, without aarti, only with pure love and devotion. The temple reminds us that God is not far away; He lives where there is love.",
      significance:
        "Showcases the divine love of Radha Krishna and Sita Ram through intricate carvings.",
      whyVisit:
        "Stunning illuminated architecture in the evening, beautiful fountain show.",
      image: "🕌",
      imageUrl: Bbtimg,
      lat: 27.5678,
      lng: 77.7012,
      distance: 2.5,
      bestTime: "6-8 PM",
      rating: 4.7,
      audioStory:
        "Built with Italian marble, this temple depicts the pastimes of Radha Krishna...",
    },
    {
      id: 3,
      name: "Giriraj Ji",
      category: "Hidden Gem",
      crowdLevel: "low",
      currentCrowd: 20,
      peakHours: "10 AM-12 PM",
      history:
        "🌿 Story of Govardhan HillGovardhan Hill is a sacred place near Vrindavan, loved deeply by Lord Krishna. The people of Braj used to worship Lord Indra for rain. Krishna taught them that they should respect nature instead of fearing it.When the villagers stopped Indra worship, Indra became angry and sent heavy rains and storms to destroy Braj. To protect everyone, little Krishna lifted Govardhan Hill on his small finger, giving shelter to people, animals, and birds for seven days and nights.Seeing this miracle, Indra realized his mistake and bowed before Krishna. Krishna then gently placed Govardhan Hill back and taught the world the lesson of humility, unity, and respect for nature.Even today, devotees perform Govardhan Parikrama and believe the hill is a living form of Krishna’s love and protection.",
      significance:
        "Sacred grove believed to be locked at night as Krishna still visits.",
      whyVisit:
        "Peaceful atmosphere, spiritual energy, beautiful nikunj (sacred groves).",
      image: "🌳",
      imageUrl: GTimg,
      lat: 27.5723,
      lng: 77.689,
      distance: 1.2,
      bestTime: "9-11 AM",
      rating: 4.6,
      audioStory:
        "This sacred grove is where the eternal divine dance took place...",
    },
    {
      id: 4,
      name: "Sri Radha Rani Temple",
      category: "Hidden Gem",
      crowdLevel: "low",
      currentCrowd: 15,
      peakHours: "6-8 AM",
      history:
        "🌸 Story of Radha Rani Temple, BarsanaBarsana is the sacred village of Radha Rani, the eternal beloved of Lord Krishna. The Radha Rani Temple stands on Brahma Parvat hill, shining like a crown over Barsana.It is believed that Radha Rani appeared here, and this place became the center of divine love and devotion. Krishna’s love finds its true meaning through Radha, who represents pure devotion and selfless love.The temple is famous for Lathmar Holi, where devotion turns into joyful celebration, remembering the playful love of Radha and Krishna. Devotees climb the steps of the hill with faith, believing that Radha Rani blesses them with love, peace, and strength.",
      significance:
        "Unique temple where Radha is the primary deity with Krishna present symbolically.",
      whyVisit:
        "Lesser-known but deeply spiritual, beautiful traditional architecture.",
      image: "⛩️",
      imageUrl: Srrtimg,
      lat: 27.5812,
      lng: 77.6923,
      distance: 0.8,
      bestTime: "6-7 AM",
      rating: 4.5,
      audioStory: "Hit Harivansh Mahaprabhu established this unique temple...",
    },
    {
      id: 5,
      name: "Madana Mohan Temple",
      category: "Hidden Gem",
      crowdLevel: "low",
      currentCrowd: 25,
      peakHours: "5-7 AM",
      history:
        "🌸 Story of Madan Mohan TempleThe Madan Mohan Temple is one of the oldest and most sacred temples in Vrindavan. It is dedicated to Lord Krishna in the form of Madan Mohan, the one who even attracts Cupid (Madan) himself.Long ago, a great devotee named Kapoor Ram Das discovered the beautiful idol of Madan Mohan near the Yamuna River. With deep devotion, he worshipped the deity. Later, a rich devotee Krishnadas Kapoor built the grand temple on a high hill overlooking Vrindavan.It is believed that Chaitanya Mahaprabhu also visited this place and blessed it. Devotees say that Madan Mohan helps people understand true devotion and control their wandering mind.",
      significance: "One of the most sacred bathing ghats in Vrindavan.",
      whyVisit: "Serene atmosphere, morning aarti, peaceful Yamuna views.",
      image: "🌊",
      imageUrl: MMTimg,
      lat: 27.5845,
      lng: 77.6856,
      distance: 1.8,
      bestTime: "5-6 AM",
      rating: 4.4,
      audioStory:
        "At this sacred ghat, Lord Krishna vanquished the horse demon Kesi...",
    },
    {
      id: 6,
      name: "Radha Vallabh Temple",
      category: "Hidden Gem",
      crowdLevel: "low",
      currentCrowd: 18,
      peakHours: "7-9 AM",
      history:
        "🌸 Story of Radha Vallabh Lal. The Radha Vallabh Temple in Vrindavan is dedicated to Radha Vallabh Lal, where Radha Rani is given the highest place. Here, Krishna is worshipped not alone, but as Radha’s beloved.The temple follows a unique tradition—there is no idol of Radha Rani, but a crown is placed beside Krishna, showing that Radha resides in his heart. This teaches that true devotion means complete surrender and love, just like Radha’s love for Krishna.Founded by Hith Harivansh Mahaprabhu, the temple focuses on pure bhakti, free from show and rituals. Devotees come here to experience deep emotional devotion (ras bhakti).",
      significance:
        "Contains the samadhi of Rupa Goswami and where Prabhupada lived.",
      whyVisit:
        "Deep spiritual heritage, peaceful environment, important for ISKCON devotees.",
      image: "🛕",
      imageUrl: RRTimg,
      lat: 27.5789,
      lng: 77.6967,
      distance: 0.5,
      bestTime: "7-8 AM",
      rating: 4.6,
      audioStory:
        "Srila Prabhupada spent time here before spreading Krishna consciousness...",
    },

    {
      id: 7,
      name: "Kusum Sarovar",
      category: "Hidden Gem",
      crowdLevel: "low",
      currentCrowd: 18,
      peakHours: "7-9 AM",
      history:
        "Story of Kusum Sarovar Kusum Sarovar is a peaceful and beautiful pond near Govardhan Hill, connected with the loving pastimes of Radha and Krishna. It is believed that Radha Rani and the gopis came here to collect flowers (kusum) for Krishna. Krishna often met Radha here, teasing her lovingly and playing the flute, filling the place with divine romance and joy. The calm water and stone steps still seem to reflect those eternal moments. The ghats of Kusum Sarovar were later beautifully built by devoted kings, making it a place of meditation, peace, and devotion. Devotees believe that sitting here brings inner calm and spiritual love.",
      significance:
        "Contains the samadhi of Rupa Goswami and where Prabhupada lived.",
      whyVisit:
        "Deep spiritual heritage, peaceful environment, important for ISKCON devotees.",
      image: "🛕",
      imageUrl: KSimg,
      lat: 27.5789,
      lng: 77.6967,
      distance: 0.5,
      bestTime: "7-8 AM",
      rating: 4.6,
      audioStory:
        "Srila Prabhupada spent time here before spreading Krishna consciousness...",
    },
    {
      id: 8,
      name: "⁠Maan Mandir",
      category: "Hidden Gem",
      crowdLevel: "low",
      currentCrowd: 18,
      peakHours: "7-9 AM",
      history:
        "Story of Maan Mandir Maan Mandir is a sacred place in Barsana, closely connected with Radha Rani’s divine love and playful anger (maan). It is believed that when Radha Rani felt lovingly upset with Lord Krishna, she came to this peaceful place. To please Radha, Krishna tried many ways—playing the flute, sending messages through sakhi friends, and finally bowing with complete surrender. Radha’s maan melted, and divine love shined brighter than ever. This place teaches that true love is not pride, but humility and surrender. Even God bows before pure devotion.",
      significance:
        "Contains the samadhi of Rupa Goswami and where Prabhupada lived.",
      whyVisit:
        "Deep spiritual heritage, peaceful environment, important for ISKCON devotees.",
      image: "🛕",
      imageUrl: MMimg,
      lat: 27.5789,
      lng: 77.6967,
      distance: 0.5,
      bestTime: "7-8 AM",
      rating: 4.6,
      audioStory:
        "Srila Prabhupada spent time here before spreading Krishna consciousness...",
    },
    {
      id: 9,
      name: "Bhandirvan",
      category: "Hidden Gem",
      crowdLevel: "low",
      currentCrowd: 18,
      peakHours: "7-9 AM",
      history:
        "🌿 Story of Bhandir VanBhandir Van is a sacred forest near Vrindavan, deeply connected with the divine pastimes of Radha and Krishna. It is believed that Radha and Krishna were married here in a divine ceremony, with Lord Brahma himself as the priest.This peaceful forest was once filled with Krishna’s playful leelas with the gopis and cowherd friends. In Bhandir Van, Krishna often played the flute, danced, and spread joy everywhere The place is also linked with the story of Bhandirasura, a demon whom Krishna defeated, after which the forest became pure and holy. The ancient Bhandir Vata (banyan tree) stands as a witness to these divine events.",
      significance:
        "Contains the samadhi of Rupa Goswami and where Prabhupada lived.",
      whyVisit:
        "Deep spiritual heritage, peaceful environment, important for ISKCON devotees.",
      image: "🛕",
      imageUrl: Bimg,
      lat: 27.5789,
      lng: 77.6967,
      distance: 0.5,
      bestTime: "7-8 AM",
      rating: 4.6,
      audioStory:
        "Srila Prabhupada spent time here before spreading Krishna consciousness...",
    },
    {
      id: 10,
      name: " ⁠Raman Reti",
      category: "Hidden Gem",
      crowdLevel: "low",
      currentCrowd: 18,
      peakHours: "7-9 AM",
      history:
        "🌼 Story of Raman RetiRaman Reti is a sacred sandy land in Vrindavan, where Lord Krishna spent his childhood with his friends. It is believed that little Krishna played, ran, and rested on this soft sand, leaving behind divine vibrations.Krishna enjoyed grazing cows here, playing games, and sharing laughter with the gopas. The golden sand of Raman Reti is considered very pure and holy, as it carries the touch of Krishna’s feet.Saints and devotees come to Raman Reti to meditate and chant, feeling deep peace and devotion. This place reminds everyone of Krishna’s simple, joyful childhood and teaches that true happiness lies in innocence and love.",
      significance:
        "Contains the samadhi of Rupa Goswami and where Prabhupada lived.",
      whyVisit:
        "Deep spiritual heritage, peaceful environment, important for ISKCON devotees.",
      image: "🛕",
      imageUrl: RRimg,
      lat: 27.5789,
      lng: 77.6967,
      distance: 0.5,
      bestTime: "7-8 AM",
      rating: 4.6,
      audioStory:
        "Srila Prabhupada spent time here before spreading Krishna consciousness...",
    },
  ];

  // Mock yatra routes
  const yatraRoutes = [
    {
      id: 1,
      name: "Quick Spiritual Circuit",
      duration: "1-hour",
      distance: "2.5 km",
      places: [1, 4, 6],
      crowdLevel: "low-medium",
      description: "Perfect for a quick darshan covering hidden gems",
      walkingTime: "45 mins + 15 mins darshan",
    },
    {
      id: 2,
      name: "Balanced Braj Experience",
      duration: "3-hour",
      distance: "5 km",
      places: [3, 4, 5, 6],
      crowdLevel: "low",
      description: "Mix of peaceful places and spiritual sites",
      walkingTime: "2 hours walk + 1 hour darshan",
    },
    {
      id: 3,
      name: "Complete Vrindavan Darshan",
      duration: "full-day",
      distance: "10 km",
      places: [1, 2, 3, 4, 5, 6],
      crowdLevel: "mixed",
      description: "Comprehensive tour of famous and hidden places",
      walkingTime: "4 hours walk + 3 hours darshan + breaks",
    },
    {
      id: 4,
      name: "Hidden Gems Trail",
      duration: "3-hour",
      distance: "4.5 km",
      places: [3, 4, 5, 6],
      crowdLevel: "low",
      description: "Explore the lesser-known spiritual treasures",
      walkingTime: "2 hours walk + 1 hour exploration",
    },
  ];
  const getCrowdColor = (level) => {
    switch (level) {
      case "low":
        return "text-green-500 bg-green-50";
      case "medium":
        return "text-yellow-500 bg-yellow-50";
      case "high":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getCrowdText = (level) => {
    switch (level) {
      case "low":
        return "Low Crowd";
      case "medium":
        return "Moderate Crowd";
      case "high":
        return "High Crowd";
      default:
        return "Unknown";
    }
  };

  const getAlternatives = (placeId) => {
    const place = places.find((p) => p.id === placeId);
    if (!place || place.crowdLevel !== "high") return [];

    return places
      .filter((p) => p.crowdLevel === "low" && p.id !== placeId)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  };

  const SmartPlaceCard = ({ place }) => (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
      onClick={() => setSelectedPlace(place)}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gradient-to-br from-orange-100 to-pink-100">
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {place.image}
          </div>
        )}
        <span
          className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-semibold ${
            place.category === "Hidden Gem"
              ? "bg-purple-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {place.category}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-3">{place.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getCrowdColor(
              place.crowdLevel,
            )}`}
          >
            {getCrowdText(place.crowdLevel)}
          </span>
          <span className="text-sm text-gray-600">Peak: {place.peakHours}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {place.history.length > 100
            ? place.history.substring(0, 100) + "..."
            : place.history}
        </p>
        <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
          View Details
        </button>
      </div>
    </div>
  );

  const renderDiscoverTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Discover Sacred Braj</h2>
        <p className="text-orange-50">
          Explore beyond the famous temples. Find hidden spiritual gems.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold">
          All Places
        </button>
        <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">
          Hidden Gems
        </button>
        <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">
          Famous Temples
        </button>
        <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">
          Low Crowd
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {places.map((place) => (
          <SmartPlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );

  const renderCrowdStatus = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Live Crowd Status</h2>
        <p className="text-blue-50">
          Real-time crowd estimates to help you plan better
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <FaUsers className="text-3xl text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Low Crowd</p>
          <p className="text-2xl font-bold text-green-600">
            {places.filter((p) => p.crowdLevel === "low").length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <FaUsers className="text-3xl text-yellow-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Medium Crowd</p>
          <p className="text-2xl font-bold text-yellow-600">
            {places.filter((p) => p.crowdLevel === "medium").length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <FaUsers className="text-3xl text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">High Crowd</p>
          <p className="text-2xl font-bold text-red-600">
            {places.filter((p) => p.crowdLevel === "high").length}
          </p>
        </div>
      </div>

      {places.map((place) => (
        <div key={place.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{place.image}</span>
              <div>
                <h3 className="font-bold text-gray-800">{place.name}</h3>
                <p className="text-xs text-gray-500">Peak: {place.peakHours}</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getCrowdColor(
                place.crowdLevel,
              )}`}
            >
              {getCrowdText(place.crowdLevel)}
            </span>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Current Capacity</span>
              <span className="font-semibold">{place.currentCrowd}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  place.crowdLevel === "high"
                    ? "bg-red-500"
                    : place.crowdLevel === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${place.currentCrowd}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <FaClock className="text-blue-600" />
              <span className="font-semibold">Best time to visit:</span>{" "}
              {place.bestTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRecommendations = () => {
    const crowdedPlaces = places.filter((p) => p.crowdLevel === "high");

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Smart Recommendations</h2>
          <p className="text-purple-50">
            Avoid crowds with intelligent alternatives
          </p>
        </div>

        {crowdedPlaces.map((place) => {
          const alternatives = getAlternatives(place.id);
          return (
            <div key={place.id} className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <span className="text-3xl">{place.image}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{place.name}</h3>
                  <span className="text-red-600 text-sm font-semibold flex items-center gap-1">
                    <FaUsers /> High Crowd ({place.currentCrowd}%)
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-700 mb-3">
                🎯 Try these peaceful alternatives instead:
              </p>

              <div className="space-y-3">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition cursor-pointer"
                    onClick={() => setSelectedPlace(alt)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{alt.image}</span>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {alt.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaWalking /> {alt.distance} km away
                          </span>
                          <span className="text-green-600 font-semibold">
                            ✓ Low Crowd
                          </span>
                        </div>
                      </div>
                    </div>
                    <FaChevronRight className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderYatraRoutes = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Smart Yatra Routes</h2>
        <p className="text-green-50">
          Curated walking trails for different time budgets
        </p>
      </div>

      <div className="grid gap-4">
        {yatraRoutes.map((route) => {
          const routePlaces = places.filter((p) => route.places.includes(p.id));
          const isExpanded = expandedRoute === route.id;

          return (
            <div
              key={route.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="p-5 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-800">
                    {route.name}
                  </h3>
                  {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {route.description}
                </p>

                <div className="flex gap-4 flex-wrap">
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <FaClock className="text-orange-500" /> {route.duration}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <FaRoute className="text-blue-500" /> {route.distance}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <FaWalking className="text-green-500" />{" "}
                    {routePlaces.length} places
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t bg-gray-50">
                  <div className="py-3">
                    <p className="text-sm text-gray-600 mb-3">
                      ⏱️ {route.walkingTime}
                    </p>
                    <div className="space-y-2">
                      {routePlaces.map((place, idx) => (
                        <div
                          key={place.id}
                          className="flex items-center gap-3 bg-white p-3 rounded-lg"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm">
                            {idx + 1}
                          </div>
                          <span className="text-2xl">{place.image}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {place.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {place.distance} km •{" "}
                              {getCrowdText(place.crowdLevel)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                    Start This Route
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSafetyAlerts = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Safety & Alerts</h2>
        <p className="text-red-50">Stay informed and safe during your yatra</p>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <FaBell className="text-red-500 text-xl mt-1" />
          <div>
            <h3 className="font-bold text-red-800 mb-1">High Crowd Alert</h3>
            <p className="text-sm text-red-700">
              Banke Bihari Temple is experiencing high crowd levels (85%).
              Consider visiting during 2-4 PM or explore alternative temples.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <FaPhoneAlt className="text-3xl text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">Emergency</h3>
          <p className="text-2xl font-bold text-blue-600">100</p>
          <p className="text-xs text-gray-500 mt-1">Police Helpline</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <FaHospital className="text-3xl text-red-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">Medical</h3>
          <p className="text-2xl font-bold text-red-600">108</p>
          <p className="text-xs text-gray-500 mt-1">Ambulance Service</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <FaShieldAlt className="text-3xl text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">Tourist Help</h3>
          <p className="text-2xl font-bold text-green-600">1363</p>
          <p className="text-xs text-gray-500 mt-1">UP Tourism</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaShieldAlt className="text-orange-500" />
          Safety Tips for Your Yatra
        </h3>
        <ul className="space-y-3">
          {[
            "Stay hydrated - carry water bottle",
            "Avoid peak hours (6-9 AM, 5-8 PM) at major temples",
            "Keep emergency contacts saved",
            "Travel in groups during early morning/late evening",
            "Use designated exits during high crowd situations",
            "Keep valuables secure and minimal",
          ].map((tip, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-sm text-gray-700"
            >
              <span className="text-green-500 mt-1">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <FaTemperatureHigh className="text-yellow-600 text-xl mt-1" />
          <div>
            <h3 className="font-bold text-yellow-800 mb-1">Weather Alert</h3>
            <p className="text-sm text-yellow-700">
              Temperature expected to reach 35°C today. Plan temple visits for
              early morning or evening.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIPrediction = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">AI Crowd Prediction</h2>
        <p className="text-indigo-50">
          Smart predictions based on historical patterns
        </p>
      </div>

      {places.slice(0, 3).map((place) => (
        <div key={place.id} className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{place.image}</span>
            <h3 className="font-bold text-gray-800">{place.name}</h3>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Today's Crowd Prediction
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {["6-9 AM", "9-12 PM", "12-3 PM", "3-6 PM", "6-9 PM"].map(
                (time, idx) => {
                  const levels = ["high", "medium", "low", "low", "high"];
                  const level = levels[idx % levels.length];
                  return (
                    <div key={idx} className="text-center">
                      <div
                        className={`h-16 rounded-lg mb-1 flex items-end justify-center pb-2 ${getCrowdColor(
                          level,
                        )}`}
                      >
                        <FaUsers />
                      </div>
                      <p className="text-xs text-gray-600">{time}</p>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
              <FaBrain /> Best time to visit: {place.bestTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPlanner = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Smart Yatra Planner</h2>
        <p className="text-pink-50">
          Get a personalized route based on your preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Time Available
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["1-hour", "3-hour", "full-day"].map((duration) => (
              <button
                key={duration}
                onClick={() => setYatraFilters({ ...yatraFilters, duration })}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition ${
                  yatraFilters.duration === duration
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Crowd Tolerance
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["low", "medium", "high"].map((level) => (
              <button
                key={level}
                onClick={() =>
                  setYatraFilters({ ...yatraFilters, crowdTolerance: level })
                }
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition capitalize ${
                  yatraFilters.crowdTolerance === level
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Walking Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["light", "moderate", "intensive"].map((pref) => (
              <button
                key={pref}
                onClick={() =>
                  setYatraFilters({ ...yatraFilters, walkingPreference: pref })
                }
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition capitalize ${
                  yatraFilters.walkingPreference === pref
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2">
          <FaRoute /> Generate My Perfect Route
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="font-bold text-gray-800 mb-3">Your Recommended Route</h3>
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-orange-800 mb-1">
            Balanced Braj Experience
          </h4>
          <p className="text-sm text-gray-600">Perfect for your preferences</p>
        </div>

        <div className="space-y-3">
          {places
            .filter((p) => p.crowdLevel === "low")
            .slice(0, 4)
            .map((place, idx) => (
              <div
                key={place.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold">
                  {idx + 1}
                </div>
                <span className="text-2xl">{place.image}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{place.name}</p>
                  <p className="text-xs text-gray-500">
                    {place.distance} km • {place.bestTime}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Community Insights</h2>
        <p className="text-teal-50">Help others with your experience</p>
      </div>

      {/* Authentication Section */}
      <div className="bg-white rounded-lg shadow-md p-5">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-gray-800">
                  {user.displayName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <FaUser className="text-4xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              Sign in to share your experience with the community
            </p>
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              <FaSignInAlt /> Sign in with Google
            </button>
          </div>
        )}
      </div>

      {/* Feedback Form - Only show if user is logged in */}
      {user && (
        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="font-bold text-gray-800 mb-4">
            Rate Current Crowd Level
          </h3>
          <div className="space-y-4">
            <select
              value={feedbackData.place}
              onChange={(e) =>
                setFeedbackData({ ...feedbackData, place: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a place</option>
              {places.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div>
              <p className="text-sm text-gray-600 mb-2">
                How crowded is it right now?
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["low", "medium", "high"].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setFeedbackData({ ...feedbackData, crowdLevel: level })
                    }
                    className={`py-2 px-4 rounded-lg font-semibold text-sm transition capitalize ${
                      feedbackData.crowdLevel === level
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={feedbackData.comment}
              onChange={(e) =>
                setFeedbackData({ ...feedbackData, comment: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="3"
              placeholder="Share your experience (optional)"
            ></textarea>

            <button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              } text-white`}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      )}

      {/* Recent Community Updates */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">
          Recent Community Updates
        </h3>
        {recentFeedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">
              No feedback yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          recentFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">
                    {feedback.place}
                  </p>
                  <p className="text-xs text-gray-500">
                    by {feedback.userName} •{" "}
                    {formatTimestamp(feedback.timestamp)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getCrowdColor(
                    feedback.crowdLevel,
                  )}`}
                >
                  {getCrowdText(feedback.crowdLevel)}
                </span>
              </div>
              {feedback.comment && (
                <p className="text-sm text-gray-600">{feedback.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  if (selectedPlace) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6">
          <button
            onClick={() => setSelectedPlace(null)}
            className="mb-4 flex items-center gap-2 text-white hover:text-orange-100"
          >
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{selectedPlace.image}</span>
            <div>
              <h1 className="text-2xl font-bold">{selectedPlace.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <FaStar className="text-yellow-300" />
                <span>{selectedPlace.rating}</span>
                <span className="ml-2">•</span>
                <span className="text-sm">{selectedPlace.category}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <div
            className={`p-4 rounded-lg ${getCrowdColor(
              selectedPlace.crowdLevel,
            )}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">
                {getCrowdText(selectedPlace.crowdLevel)}
              </span>
              <span className="text-sm">
                {selectedPlace.currentCrowd}% capacity
              </span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-white"
                style={{ width: `${selectedPlace.currentCrowd}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaClock className="text-orange-500" /> Best Time to Visit
            </h2>
            <p className="text-gray-700">{selectedPlace.bestTime}</p>
            <p className="text-sm text-gray-500 mt-2">
              Peak Hours: {selectedPlace.peakHours}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <h2 className="font-bold text-gray-800 mb-3">History</h2>
            <p className="text-gray-700">{selectedPlace.history}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <h2 className="font-bold text-gray-800 mb-3">
              Spiritual Significance
            </h2>
            <p className="text-gray-700">{selectedPlace.significance}</p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-5">
            <h2 className="font-bold text-orange-800 mb-3">
              Why Visit This Place?
            </h2>
            <p className="text-gray-700">{selectedPlace.whyVisit}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaHeadphones className="text-purple-500" /> Audio Story
            </h2>
            <p className="text-gray-700 mb-3">{selectedPlace.audioStory}</p>
            <button className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition">
              <FaHeadphones /> Play Audio Guide
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" /> Location Details
            </h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-700">
                <FaWalking className="text-green-500" />{" "}
                {selectedPlace.distance} km from your location
              </p>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                Open in Maps
              </button>
            </div>
          </div>

          {selectedPlace.crowdLevel === "high" && (
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="font-bold text-gray-800 mb-3">
                🎯 Peaceful Alternatives
              </h2>
              <div className="space-y-2">
                {getAlternatives(selectedPlace.id).map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => setSelectedPlace(alt)}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition"
                  >
                    <span className="text-2xl">{alt.image}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{alt.name}</p>
                      <p className="text-xs text-gray-500">
                        {alt.distance} km • Low Crowd
                      </p>
                    </div>
                    <FaChevronRight className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-yellow-600 to-pink-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <h1 className="text-3xl font-bold mb-1">ॐ Smart Yatra</h1>
        <p className="text-orange-100 text-sm">
          Smart Spiritual Discovery Platform
        </p>
      </header>

      <nav className="bg-white shadow-md sticky top-[88px] z-10 overflow-x-auto">
        <div className="flex gap-1 p-2">
          {[
            { id: "discover", icon: FaMapMarkerAlt, label: "Discover" },
            { id: "crowd", icon: FaUsers, label: "Live Crowd" },
            { id: "recommendations", icon: FaBrain, label: "Smart Tips" },
            { id: "routes", icon: FaRoute, label: "Routes" },
            { id: "prediction", icon: FaChartLine, label: "AI Predict" },
            { id: "safety", icon: FaBell, label: "Safety" },
            { id: "planner", icon: FaCalendarAlt, label: "Planner" },
            { id: "feedback", icon: FaStar, label: "Feedback" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 pb-20">
        {activeTab === "discover" && renderDiscoverTab()}
        {activeTab === "crowd" && renderCrowdStatus()}
        {activeTab === "recommendations" && renderRecommendations()}
        {activeTab === "routes" && renderYatraRoutes()}
        {activeTab === "prediction" && renderAIPrediction()}
        {activeTab === "safety" && renderSafetyAlerts()}
        {activeTab === "planner" && renderPlanner()}
        {activeTab === "feedback" && renderFeedback()}
      </main>
    </div>
  );
};

export default BrajYatra2;
