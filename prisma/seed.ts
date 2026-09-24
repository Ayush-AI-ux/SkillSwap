import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);

const gigs = [
  { title: "YouTube video editing", category: "Video Editing", rate: 60, creatorName: "Aarav", description: "Fast cuts, captions and color grading for your YouTube videos.", age: 2 },
  { title: "Instagram Reels editor", category: "Video Editing", rate: 35, creatorName: "Meera", description: "Trendy short-form edits with music sync and text effects.", age: 9 },
  { title: "Logo design", category: "Graphic Design", rate: 80, creatorName: "Kabir", description: "A clean, modern logo with three concepts and two revisions.", age: 20 },
  { title: "Thumbnail design pack", category: "Graphic Design", rate: 25, creatorName: "Meera", description: "Eye-catching thumbnails that raise click-through rate.", age: 1 },
  { title: "Lo-fi beat production", category: "Music & Audio", rate: 50, creatorName: "Riya", description: "Original lo-fi beat for your videos or podcast intro.", age: 5 },
  { title: "Podcast audio cleanup", category: "Music & Audio", rate: 40, creatorName: "Kabir", description: "Noise removal, leveling and mastering for one episode.", age: 15 },
  { title: "Blog post writing", category: "Writing", rate: 30, creatorName: "Ishaan", description: "SEO-friendly 800 word article on any topic you choose.", age: 3 },
  { title: "Script writing for shorts", category: "Writing", rate: 20, creatorName: "Riya", description: "Punchy 60-second scripts with a strong hook.", age: 12 },
  { title: "Social media content calendar", category: "Social Media", rate: 45, creatorName: "Ishaan", description: "A 30-day posting plan with captions and hashtags.", age: 7 },
  { title: "Instagram page growth audit", category: "Social Media", rate: 55, creatorName: "Aarav", description: "Profile review with an action plan to grow your followers.", age: 30 },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.gig.deleteMany();

  const created = [];
  for (const { age, ...g } of gigs) {
    created.push(await prisma.gig.create({ data: { ...g, createdAt: daysAgo(age) } }));
  }

  await prisma.booking.createMany({
    data: [
      { gigId: created[0].id, clientName: "Sam", clientEmail: "sam@example.com", message: "Need a 10 min vlog edited.", status: "Pending" },
      { gigId: created[0].id, clientName: "Priya", clientEmail: "priya@example.com", message: "Weekly edits?", status: "Accepted" },
      { gigId: created[2].id, clientName: "Sam", clientEmail: "sam@example.com", message: "Logo for my cafe.", status: "Declined", declineReason: "Busy" },
    ],
  });
}

main().finally(() => prisma.$disconnect());