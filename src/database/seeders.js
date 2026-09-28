import { db } from "./db";

export async function seedDatabase() {
  const userCount = await db.users.count();
  const profileCount = await db.profile.count();
  const projectCount = await db.projects.count();

  if (userCount === 0) {
    await db.users.add({
      username: "ardipratama",
      email: "hello@ardipratama.studio",
      phone_number: "+62 812 3456 7890",
      gender: "male",
      skill: "UI/UX Design, Branding, Web Design",
      birthday: "1995-06-15",
    });
  }

  if (profileCount === 0) {
    await db.profile.add({
      username: "ardipratama",
      full_name: "Ardi Pratama",
      role: "Independent UI/UX Designer",
      tagline: "Crafting intuitive, user-friendly experiences through wireframing, prototyping, and visual design.",
      heading: "Design That feels human.",
      about:
        "I'm Ardi, a multidisciplinary designer focused on identity, interfaces, and the small details between them.",
      bio: "For the last 7 years, I've partnered with people who care deeply about what they make — from early-stage founders to teams building for millions.",
      location: "Jakarta, Indonesia",
      experience_years: 7,
      total_projects: 120,
      average_rating: 5.0,
      email: "hello@ardipratama.studio",
      phone: "+62 812 3456 7890",
    });
  }

  if (projectCount === 0) {
    await db.projects.bulkAdd([
      {
        title: "Ruang Rasa",
        subtitle: "Brand identity",
        year: "2024",
        category: "branding",
        color: "sage",
        initials: "RR",
        label: "Brand Identity",
        description:
          "Ruang Rasa is a brand identity project for a local coffee shop that wanted to convey warmth and authenticity. I developed the visual system, packaging, and brand guidelines.",
        client: "Ruang Rasa Coffee",
        role: "Brand Designer",
        duration: "2 Months",
        demo_url: "#",
        created_at: new Date().toISOString(),
      },
      {
        title: "Kelana App",
        subtitle: "Product design",
        year: "2024",
        category: "product",
        color: "sand",
        initials: "K",
        label: "Product Design",
        description:
          "Kelana is a travel companion designed around clarity. I shaped the product strategy, visual system, and key flows to make discovery feel inspiring without becoming overwhelming.",
        client: "Kelana Travel",
        role: "Product Designer",
        duration: "3 Months",
        demo_url: "#",
        created_at: new Date().toISOString(),
      },
      {
        title: "Atelier No. 8",
        subtitle: "Web experience",
        year: "2023",
        category: "web",
        color: "steel",
        initials: "A8",
        label: "Web Experience",
        description:
          "Atelier No. 8 is a web experience project for a fashion brand. I designed and developed a responsive website with focus on visual storytelling and seamless user experience.",
        client: "Atelier No. 8",
        role: "UI/UX Designer",
        duration: "4 Months",
        demo_url: "#",
        created_at: new Date().toISOString(),
      },
    ]);
  }
}
