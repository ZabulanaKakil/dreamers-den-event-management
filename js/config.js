/**
 * Site-wide configuration — edit values here without touching HTML.
 */
window.SITE_CONFIG = {
  siteName: "Dreamers Den",
  siteSubtitle: "Event Management",
  tagline: "Quality in time",

  /** Link back to main Dreamers Den website */
  mainSiteUrl: "#",

  googleFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSctHyBbmzm6XlcWNYjFZiG6GluaRxROuQ-Vx39ICkQEi1oRPQ/viewform?usp=publish-editor",
  googleFormEmbedUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSctHyBbmzm6XlcWNYjFZiG6GluaRxROuQ-Vx39ICkQEi1oRPQ/viewform?embedded=true",

  contact: {
    email: "info@dreamersden.org",
    address: "Mirpur DOHS, Dhaka, Bangladesh",
    mapsUrl: "https://maps.app.goo.gl/w8bwZoHwkQiR7afR6",
    hours: "Sun – Fri, 10:00 – 18:00",
    phones: [
      { name: "Mr. Zahid Hasan Shumon", role: "Director", number: "+8801775313689", whatsapp: "8801775313689" },
      { name: "Captain Tanvir Nahian", role: "General Manager", note: "retired", number: "+8801790136979", whatsapp: "8801790136979" },
    ],
    social: {
      facebook: "#",
      instagram: "#",
    },
  },

  services: [
    {
      id: "sound-system",
      name: "Sound System",
      description:
        "Professional audio setup for events of any scale — clear sound for speeches, music, and performances.",
      image: "assets/images/services/sound-system.jpg",
    },
    {
      id: "led",
      name: "LED",
      description:
        "Dynamic LED displays and screens to engage your audience and elevate your stage presence.",
      image: "assets/images/services/led.jpg",
    },
    {
      id: "branding",
      name: "Branding",
      description:
        "Cohesive visual identity across your event — logos, colours, and branded touchpoints.",
      image: "assets/images/services/branding.jpg",
    },
    {
      id: "banner",
      name: "Banner / Advertisement",
      description:
        "Eye-catching banners and promotional materials tailored to your event and venue.",
      image: "assets/images/services/banner.jpg",
    },
    {
      id: "stage-decoration",
      name: "Stage Decoration",
      description:
        "Transform your stage with creative décor that matches your theme and wows your guests.",
      image: "assets/images/services/stage-decoration.jpg",
    },
    {
      id: "lighting",
      name: "Lighting",
      description:
        "Atmospheric and functional lighting design to set the mood and highlight key moments.",
      image: "assets/images/services/lighting.jpg",
    },
    {
      id: "documentary",
      name: "Documentary",
      description:
        "Capture the story of your event with professional documentary-style coverage.",
      image: "assets/images/services/documentary.jpg",
    },
    {
      id: "videography",
      name: "Videography",
      description:
        "High-quality video production — from highlights to full event recordings.",
      image: "assets/images/services/videography.jpg",
    },
    {
      id: "furnishments",
      name: "Furnishments",
      description:
        "Furniture and fittings arranged for comfort, style, and flow at your venue.",
      image: "assets/images/services/furnishments.jpg",
    },
    {
      id: "layouts",
      name: "Presentation & Design of Layouts",
      description:
        "Floor plans and spatial design so every guest enjoys the best experience.",
      image: "assets/images/services/layouts.jpg",
    },
  ],

  partners: [
    { name: "Partner One", category: "Venue", image: "" },
    { name: "Partner Two", category: "Catering", image: "" },
    { name: "Partner Three", category: "Media", image: "" },
    { name: "Partner Four", category: "Equipment", image: "" },
    { name: "Partner Five", category: "Entertainment", image: "" },
    { name: "Partner Six", category: "Sponsor", image: "" },
  ],

  milestones: [
    {
      type: "milestone",
      year: "2020",
      title: "Where it began",
      text: "Dreamers Den Event Management launched with a clear promise: quality events, delivered on time.",
      image: "assets/images/logo.png",
      imageAlt: "Dreamers Den logo",
      launch: true,
    },
    {
      type: "milestone",
      year: "2021",
      title: "Building momentum",
      text: "Our first seasons of live work — smaller stages, growing trust, and hands-on production across sound and visuals.",
      image: "assets/images/logo.png",
      imageAlt: "Dreamers Den — 2021 (photo coming soon)",
    },
    {
      type: "gap",
      year: "2021 → 2023",
      title: "Post-COVID pause",
      text: "Operations slowed through the pandemic years as we regrouped, adapted, and prepared for the next chapter.",
    },
    {
      type: "milestone",
      year: "2023",
      title: "Back on stage",
      text: "A renewed push into full event production — expanded services, stronger vendor ties, and busier calendars.",
      image: "assets/images/logo.png",
      imageAlt: "Dreamers Den — 2023 (photo coming soon)",
    },
    {
      type: "milestone",
      year: "2024",
      title: "Steady growth",
      text: "More repeat clients and larger productions as we refined how we plan, crew, and deliver every show.",
      image: "assets/images/logo.png",
      imageAlt: "Dreamers Den — 2024 (photo coming soon)",
    },
    {
      type: "gap",
      year: "Jul 2024",
      title: "Bangladesh — July 2024",
      text: "A difficult period during unrest in Bangladesh affected our team and partners. We paused, reflected, and focused on safety before moving forward.",
    },
    {
      type: "milestone",
      year: "2026",
      title: "Today and ahead",
      text: "We are booking the next generation of events — bringing the same standards of quality and timing to every brief we take on.",
      image: "assets/images/logo.png",
      imageAlt: "Dreamers Den — 2026 (photo coming soon)",
    },
  ],
};
