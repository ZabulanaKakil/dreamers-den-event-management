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

  serviceGroups: [
    {
      id: "event-management",
      heading: "Event Management",
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
    },
    {
      id: "suvenier",
      heading: "Suvenier",
      services: [
        {
          id: "gift-combo",
          name: "Gift Combo",
          description:
            "Curated gift combo packs — thoughtfully assembled hampers and item sets for events, clients, and special occasions.",
          image: "assets/images/services/gift-combo.jpg",
        },
        {
          id: "garments",
          name: "Garments",
          description:
            "Quality track suits and apparel for teams, reunions, and corporate wear — comfortable, durable, and ready to brand.",
          image: "assets/images/services/garments-tracksuit.jpg",
        },
        {
          id: "customised-branding",
          name: "Customised Branding Items",
          description:
            "Logo placement, colours, and artwork on garments — full tracksuit breakdowns from hood to hem for precise custom branding.",
          image: "assets/images/services/customised-branding-tracksuit.jpg",
          imageFit: "contain",
        },
      ],
    },
  ],

  milestoneTextDefault:
    "We delivered this event successfully — handling production, setup, and on spot coordination from planning through show day.",

  milestones: [
    {
      type: "milestone",
      year: "2019",
      title: "OC&S Reunion",
      text: "We supported the OCAS reunion with on-site production work — banners, festoons, and venue decorations that welcomed everyone back together, with on spot coordination throughout.",
      image: "assets/images/journey/ocas.jpg",
      imageAlt: "OC&S Reunion 2019 — banners and decorations",
      launch: true,
    },
    {
      type: "milestone",
      year: "2020",
      title: "Action Aid",
      text: "We delivered the Action Aid programme — art gallery setup, stage decoration, branding, lighting, and sound system — with on spot coordination from build to show day.",
      image: "assets/images/journey/actionaid.jpg",
      imageAlt: "Action Aid — art gallery and event branding",
    },
    {
      type: "milestone",
      year: "2020",
      title: "Jolshiri Investor Meeting",
      text: "We prepared the Jolshiri investor meeting with full stage decoration and on spot coordination for presenters and guests.",
      image: "assets/images/journey/jolshiri.jpg",
      imageAlt: "Jolshiri Investor Meeting — stage decoration",
    },
    {
      type: "gap",
      year: "2020 → 2021",
      title: "Post-COVID pause",
      text: "Operations slowed through the pandemic years as we regrouped, adapted, and prepared for the next chapter.",
    },
    {
      type: "milestone",
      year: "2021",
      title: "50 Years Celebration, Bangladesh Army",
      text: "We supported the Bangladesh Army golden jubilee with stage decoration, branding, advertisement, lighting, and sound system — plus on spot coordination across the programme.",
      image: "assets/images/journey/50years.jpg",
      imageAlt: "50 Years Celebration, Bangladesh Army — stage and branding",
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
      text: "We delivered the Indo-Pacific Armies Management Seminar with stage decoration, entrance gate decoration, branding, and on spot coordination throughout the event.",
      image: "assets/images/journey/indopacific.jpg",
      imageAlt: "46th Indo-Pacific Armies Management Seminar — entrance and branding",
    },
    {
      type: "milestone",
      year: "2022",
      title: "OC&S Reunion",
      text: "We supported the OC&S reunion with stage decoration, lighting, sound system, gate decoration, branding, and on spot coordination on the day.",
      image: "assets/images/journey/ocas2022.png",
      imageAlt: "OC&S Reunion 2022 — stage decoration and branding",
    },
    {
      type: "milestone",
      year: "2023",
      title: "Strategic Conference, Beacon Pharmaceuticals Limited",
      text: "We delivered the Beacon Pharmaceuticals strategic conference with stage decoration, lighting, sound system, and on spot coordination for speakers and delegates.",
      image: "assets/images/journey/pharma.png",
      imageAlt: "Beacon Pharmaceuticals strategic conference — stage setup",
    },
    {
      type: "milestone",
      year: "2023",
      title: "Dhaka Elevated Expressway Inauguration",
      text: "We supported the Dhaka Elevated Expressway inauguration with inauguration wall decoration, branding, stage decoration, and on spot coordination on the day.",
      image: "assets/images/journey/elevated.jpg",
      imageAlt: "Dhaka Elevated Expressway inauguration — decorations and branding",
    },
    {
      type: "milestone",
      year: "2023",
      title: "Bangabandhu Sheikh Mujibur Rahman Tunnel Inauguration",
      text: "We handled banners, the inauguration stone plate, branding, and on spot coordination for the Bangabandhu Sheikh Mujibur Rahman Tunnel inauguration ceremony.",
      image: "assets/images/journey/tunnel.jpg",
      imageAlt: "Bangabandhu Sheikh Mujibur Rahman Tunnel inauguration",
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
      title: "July 2024 Unrest",
      text: "A difficult period during unrest in Bangladesh affected our team and partners. We paused, reflected, and focused on safety before moving forward.",
    },
    {
      type: "milestone",
      year: "2026",
      title: "Air Traffic Control Room inauguration",
      text: "We hosted the full inauguration ceremony — from stage decoration and setup to preparing the inauguration slate — with on spot coordination for every detail on the day.",
      image: "assets/images/journey/2026-air.jpg",
      imageAlt: "Air Traffic Control Room inauguration, 2026",
    },
    {
      type: "milestone",
      year: "2026",
      title: "Concert for Cancer Connect of CCI Foundation",
      text: "We prepared the stage for the performers and dressed the whole auditorium for members attending — layout, atmosphere, and production — with on spot coordination for an evening of music and community.",
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
