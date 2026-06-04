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

  milestoneTextDefault:
    "We delivered this event successfully — handling production, setup, and on-site coordination from planning through show day.",

  milestones: [
    {
      type: "milestone",
      year: "2019",
      title: "OC&S Reunion",
      text: "We supported the OCAS reunion with on-site production work — banners, festoons, and venue decorations that welcomed everyone back together.",
      image: "assets/images/journey/ocas.jpg",
      imageAlt: "OC&S Reunion 2019 — banners and decorations",
      launch: true,
    },
    {
      type: "milestone",
      year: "2020",
      title: "Action Aid",
      textOnly: true,
    },
    {
      type: "milestone",
      year: "2020",
      title: "Jolshiri Investor Meeting",
      textOnly: true,
    },
    {
      type: "gap",
      year: "2020 → 2022",
      title: "Post-COVID pause",
      text: "Operations slowed through the pandemic years as we regrouped, adapted, and prepared for the next chapter.",
    },
    {
      type: "milestone",
      year: "2021",
      title: "50 Years Celebration, Bangladesh Army",
      textOnly: true,
    },
    {
      type: "milestone",
      year: "2022",
      title: "Crown Award for Excellence",
      textOnly: true,
    },
    {
      type: "milestone",
      year: "2022",
      title: "46th Indo-Pacific Armies Management Seminar, Bangladesh",
      textOnly: true,
    },
    {
      type: "milestone",
      year: "2022",
      title: "OC&S Reunion",
      textOnly: true,
    },
    {
      type: "milestone",
      year: "2023",
      title: "Strategic Conference, Beacon Pharmaceuticals Limited",
      textOnly: true,
    },
    {
      type: "milestone",
      year: "2023",
      title: "Dhaka Elevated Expressway Inauguration",
      textOnly: true,
    },
    {
      type: "milestone",
      year: "2023",
      title: "Bangabandhu Sheikh Mujibur Rahman Tunnel Inauguration",
      textOnly: true,
    },
    {
      type: "milestone",
      year: "2023",
      title: "Sheikh Kamal 2nd Bangladesh Youth Games",
      textOnly: true,
    },
    {
      type: "milestone",
      year: "2024",
      title: "Hardware Display",
      textOnly: true,
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
      title: "Air Traffic Control Room inauguration",
      text: "We hosted the full inauguration ceremony — from stage decoration and setup to preparing the inauguration slate and coordinating every detail on the day.",
      image: "assets/images/journey/2026-air.jpg",
      imageAlt: "Air Traffic Control Room inauguration, 2026",
    },
    {
      type: "milestone",
      year: "2026",
      title: "Concert for Cancer Connect of CCI Foundation",
      text: "We prepared the stage for the performers and dressed the whole auditorium for members attending — layout, atmosphere, and production for an evening of music and community.",
      images: [
        {
          src: "assets/images/journey/concert for hope.jpg",
          alt: "Concert for Cancer Connect — stage preparation",
        },
        {
          src: "assets/images/journey/concert for hope renessa.jpg",
          alt: "Concert for Cancer Connect — auditorium setup",
        },
      ],
    },
  ],
};
