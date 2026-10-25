/**
 * Site-wide configuration — edit values here without touching HTML.
 */
window.SITE_CONFIG = {
  siteName: "Dreamers Den",
  siteSubtitle: "Event Management & Garments",
  tagline: "Quality in time",

  /** Canonical site origin for Open Graph / sitemap (no trailing slash) */
  siteUrl: "https://zabulanakakil.github.io/dreamers-den-event-management",

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

  testimonials: [
    {
      quote: "From stage build to live coordination, Dreamers Den kept every cue on time and every detail polished.",
      name: "Institutional Client",
      role: "Ceremony Organiser",
    },
    {
      quote: "Their garments and branding packs arrived production-ready — clean embroidery, accurate colours, zero last-minute stress.",
      name: "Reunion Committee Lead",
      role: "Apparel & Souvenirs",
    },
    {
      quote: "On-spot coordination made a complex inauguration feel calm. Sound, LED, and décor landed exactly as briefed.",
      name: "Project Coordinator",
      role: "Infrastructure Opening",
    },
  ],

  faqs: [
    {
      q: "How far in advance should we book?",
      a: "For major inaugurations and seminars we recommend 3–6 weeks. Smaller décor or branding packages can often be turned around faster depending on calendar load.",
    },
    {
      q: "Do you handle both events and custom garments?",
      a: "Yes. Event Management covers live production; Garments Supply covers apparel, embroidery, and gift combos. Many clients use both for the same programme.",
    },
    {
      q: "Can your team stay on site during the programme?",
      a: "On-spot coordination is standard for our productions — our crew remains through load-in, show cues, and wrap.",
    },
    {
      q: "What is the typical garment order size?",
      a: "We support institutional and reunion runs. Share quantities, sizing breakdowns, and artwork in the inquiry form for a tailored quote.",
    },
  ],

  serviceGroups: [
    {
      id: "event-management",
      heading: "Event Management",
      eyebrow: "Division 01 · Live Production",
      tagline: "Stage, Sound, Lighting & End-to-End Ceremony Execution",
      description:
        "Full-scale technical production and creative staging for state inaugurations, institutional conferences, military seminars, and concerts — engineered with precision and on-spot coordination.",
      theme: "events",
      badge: "10 Production Services",
      highlights: ["Live Audio & LED", "Custom Stage Architecture", "On-Spot Coordination"],
      services: [
        {
          id: "sound-system",
          name: "Sound System",
          category: "Audio Engineering",
          description:
            "Professional audio setup for events of any scale — clear sound for speeches, music, and performances.",
          image: "assets/images/services/sound-system.jpg",
        },
        {
          id: "led",
          name: "LED",
          category: "Visual Display",
          description:
            "Dynamic LED displays and screens to engage your audience and elevate your stage presence.",
          image: "assets/images/services/led.jpg",
        },
        {
          id: "branding",
          name: "Branding",
          category: "Event Identity",
          description:
            "Cohesive visual identity across your event — logos, colours, and branded touchpoints.",
          image: "assets/images/services/branding.jpg",
        },
        {
          id: "banner",
          name: "Banner / Advertisement",
          category: "Print & Signage",
          description:
            "Eye-catching banners and promotional materials tailored to your event and venue.",
          image: "assets/images/services/banner.jpg",
        },
        {
          id: "stage-decoration",
          name: "Stage Decoration",
          category: "Scenic & Décor",
          description:
            "Transform your stage with creative décor that matches your theme and wows your guests.",
          image: "assets/images/services/stage-decoration.jpg",
        },
        {
          id: "lighting",
          name: "Lighting",
          category: "Stage Atmosphere",
          description:
            "Atmospheric and functional lighting design to set the mood and highlight key moments.",
          image: "assets/images/services/lighting.jpg",
        },
        {
          id: "documentary",
          name: "Documentary",
          category: "Story & Archive",
          description:
            "Capture the story of your event with professional documentary-style coverage.",
          image: "assets/images/services/documentary.jpg",
        },
        {
          id: "videography",
          name: "Videography",
          category: "Broadcast & Film",
          description:
            "High-quality video production — from highlights to full event recordings.",
          image: "assets/images/services/videography.jpg",
        },
        {
          id: "furnishments",
          name: "Furnishments",
          category: "VIP & Venue Setup",
          description:
            "Furniture and fittings arranged for comfort, style, and flow at your venue.",
          image: "assets/images/services/furnishments.jpg",
        },
        {
          id: "layouts",
          name: "Presentation & Design of Layouts",
          category: "Spatial Planning",
          description:
            "Floor plans and spatial design so every guest enjoys the best experience.",
          image: "assets/images/services/layouts.jpg",
        },
      ],
    },
    {
      id: "garments-supply",
      heading: "Garments Supply",
      eyebrow: "Division 02 · Apparel & Merchandising",
      tagline: "Custom Apparel, Tracksuits, Souvenirs & Executive Gift Combos",
      description:
        "Studio-grade garment manufacturing, precision logo embroidery, and curated souvenir hampers tailored for institutional reunions, corporate teams, and VIP delegates.",
      theme: "garments",
      badge: "36 Tracksuit Colourways",
      highlights: ["Custom Tracksuits & Apparel", "Precision Logo Branding", "Executive Gift Combos"],
      services: [
        {
          id: "garments",
          name: "Garments & Team Apparel",
          category: "Bulk Apparel Supply",
          specs: ["Custom Sizing", "Breathable Fabrics", "Reunion & Institutional Wear"],
          description:
            "Quality track suits and apparel for teams, reunions, and corporate wear — comfortable, durable, and ready to brand.",
          image: "assets/images/services/garments-tracksuit.jpg",
        },
        {
          id: "customised-branding",
          name: "Customised Branding Items",
          category: "Technical Breakdown & Print",
          specs: ["Embroidery & Screen Print", "Full Panel Colourways", "Logo Precision"],
          description:
            "Logo placement, colours, and artwork on garments — full tracksuit breakdowns from hood to hem for precise custom branding.",
          image: "assets/images/services/customised-branding-tracksuit.jpg",
          imageFit: "contain",
        },
        {
          id: "gift-combo",
          name: "Executive Gift Combo",
          category: "Curated Souvenir Packs",
          specs: ["Bespoke Packaging", "Branded Merchandise", "VIP Delegate Hampers"],
          description:
            "Curated gift combo packs — thoughtfully assembled hampers and item sets for events, clients, and special occasions.",
          image: "assets/images/services/gift-combo.jpg",
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
      title: "Sylhet Cadet College Reunion",
      category: "reunion",
      client: "Old Cadets' Association, Sylhet (OCAS)",
      text: "We produced the Sylhet Cadet College reunion for OCAS — stage, lighting, and the reunion sign — with on-spot coordination from load-in through the evening programme.",
      images: [
        {
          src: "assets/images/journey/SCC reunion.jpg",
          alt: "Sylhet Cadet College Reunion 2019 — stage and lighting",
        },
        {
          src: "assets/images/journey/scc-award.jpg",
          alt: "Sylhet Cadet College Reunion 2019 — stage presentation",
        },
        {
          src: "assets/images/journey/scc-ocas.jpg",
          alt: "OCAS sign at the Sylhet Cadet College Reunion",
        },
      ],
      launch: true,
    },
    {
      type: "milestone",
      year: "2020",
      title: "Action Aid",
      category: "exhibition",
      text: "We delivered the Action Aid programme — art gallery setup, stage decoration, branding, lighting, and sound system — with on spot coordination from build to show day.",
      image: "assets/images/journey/actionaid.jpg",
      imageAlt: "Action Aid — art gallery and event branding",
    },
    {
      type: "milestone",
      year: "2020",
      title: "Jolshiri Investor Meeting",
      category: "conference",
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
      category: "ceremony",
      text: "We supported the Bangladesh Army golden jubilee with stage decoration, branding, advertisement, lighting, and sound system — plus on spot coordination across the programme.",
      image: "assets/images/journey/50years.jpg",
      imageAlt: "50 Years Celebration, Bangladesh Army — stage and branding",
    },
    {
      type: "milestone",
      year: "2022",
      title: "Crown Award for Excellence",
      category: "ceremony",
      client: "Crown Cement",
      text: "We dressed the Crown Award for Excellence for Crown Cement — stage, branded backdrop, and entrance displays — with on-spot coordination through the ceremony.",
      images: [
        {
          src: "assets/images/journey/crown-stage.jpg",
          alt: "Crown Award for Excellence — stage and LED wall",
        },
        {
          src: "assets/images/journey/crown-backdrop.jpg",
          alt: "Crown Award for Excellence — branded backdrop",
        },
        {
          src: "assets/images/journey/crown-entrance.jpg",
          alt: "Crown Award for Excellence — venue entrance branding",
        },
      ],
    },
    {
      type: "milestone",
      year: "2022",
      title: "46th Indo-Pacific Armies Management Seminar, Bangladesh",
      category: "conference",
      text: "We delivered the Indo-Pacific Armies Management Seminar with stage decoration, entrance gate decoration, branding, and on spot coordination throughout the event.",
      image: "assets/images/journey/indopacific.jpg",
      imageAlt: "46th Indo-Pacific Armies Management Seminar — entrance and branding",
    },
    {
      type: "milestone",
      year: "2022",
      title: "OC&S Reunion",
      category: "reunion",
      text: "We supported the OC&S reunion with stage decoration, lighting, sound system, gate decoration, branding, and on spot coordination on the day.",
      image: "assets/images/journey/ocas2022.png",
      imageAlt: "OC&S Reunion 2022 — stage decoration and branding",
    },
    {
      type: "milestone",
      year: "2023",
      title: "Strategic Conference, Beacon Pharmaceuticals Limited",
      category: "conference",
      text: "We delivered the Beacon Pharmaceuticals strategic conference with stage decoration, lighting, sound system, and on spot coordination for speakers and delegates.",
      image: "assets/images/journey/pharma.png",
      imageAlt: "Beacon Pharmaceuticals strategic conference — stage setup",
    },
    {
      type: "milestone",
      year: "2023",
      title: "Dhaka Elevated Expressway Inauguration",
      category: "inauguration",
      text: "We supported the Dhaka Elevated Expressway inauguration with inauguration wall decoration, branding, stage decoration, and on spot coordination on the day.",
      image: "assets/images/journey/elevated.jpg",
      imageAlt: "Dhaka Elevated Expressway inauguration — decorations and branding",
    },
    {
      type: "milestone",
      year: "2023",
      title: "Bangabandhu Sheikh Mujibur Rahman Tunnel Inauguration",
      category: "inauguration",
      text: "We handled banners, the inauguration stone plate, branding, and on spot coordination for the Bangabandhu Sheikh Mujibur Rahman Tunnel inauguration ceremony.",
      image: "assets/images/journey/tunnel.jpg",
      imageAlt: "Bangabandhu Sheikh Mujibur Rahman Tunnel inauguration",
    },
    {
      type: "milestone",
      year: "2023",
      title: "Sheikh Kamal 2nd Bangladesh Youth Games",
      category: "ceremony",
      text: "We supported the Sheikh Kamal 2nd Bangladesh Youth Games — parade presentation and the awards stage — with on-spot coordination across the programme.",
      images: [
        {
          src: "assets/images/journey/youth-parade.jpg",
          alt: "Sheikh Kamal Youth Games — parade on the track",
        },
        {
          src: "assets/images/journey/youth-podium.jpg",
          alt: "Sheikh Kamal Youth Games — awards presentation",
        },
      ],
    },
    {
      type: "milestone",
      year: "2024",
      title: "Hardware Display",
      category: "exhibition",
      client: "Central Mechanical Transport Depot (CMTD)",
      text: "We built the hardware display for the Central Mechanical Transport Depot — photo walls, model cases, and gallery lighting — with on-spot coordination through the exhibition.",
      images: [
        {
          src: "assets/images/journey/hardware-gallery.jpg",
          alt: "Hardware Display 2024 — gallery panorama",
        },
        {
          src: "assets/images/journey/hardware-wall.jpg",
          alt: "Hardware Display 2024 — framed exhibition wall",
        },
        {
          src: "assets/images/journey/hardware-models.jpg",
          alt: "Hardware Display 2024 — models and display cases",
        },
      ],
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
      title: "Inauguration of Air Traffic Management Center (ATMC)",
      category: "inauguration",
      client: "Civil Aviation Authority of Bangladesh (CAAB)",
      text: "We produced the inauguration of the Air Traffic Management Center at Hazrat Shahjalal International Airport on 20 April 2026 — gate branding, stage, and the inauguration plaque — with on-spot coordination through the ceremony.",
      images: [
        {
          src: "assets/images/journey/2026-air.jpg",
          alt: "Air Traffic Management Center inauguration — approach and control tower",
        },
        {
          src: "assets/images/journey/atmc-gate.jpg",
          alt: "Air Traffic Management Center inauguration — branded entrance gate",
        },
        {
          src: "assets/images/journey/atmc-stage.jpg",
          alt: "Air Traffic Management Center inauguration — stage inside the tent",
        },
        {
          src: "assets/images/journey/atmc-plaque.jpg",
          alt: "Inauguration plaque for the Air Traffic Management Center, 20 April 2026",
        },
      ],
    },
    {
      type: "milestone",
      year: "2026",
      title: "Concert for Cancer Connect of CCI Foundation",
      category: "concert",
      client: "Cancer Connect Initiative Foundation (CCI)",
      text: "We prepared the stage for the performers and dressed the auditorium for members attending — layout, atmosphere, and production — with on-spot coordination for an evening of music and community.",
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
