import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const work = await prisma.project.create({
    data: { name: "Work", color: "#3b82f6" },
  });
  const personal = await prisma.project.create({
    data: { name: "Personal", color: "#10b981" },
  });
  const health = await prisma.project.create({
    data: { name: "Health", color: "#f59e0b" },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Review quarterly report and send feedback to team",
        projectId: work.id,
        priority: 4,
        estimateMinutes: 45,
        status: "OPEN",
      },
      {
        title: "Schedule dentist appointment",
        projectId: health.id,
        priority: 2,
        estimateMinutes: 10,
        status: "OPEN",
      },
      {
        title: "Buy groceries for the week",
        projectId: personal.id,
        priority: 3,
        estimateMinutes: 40,
        status: "OPEN",
      },
      {
        title: "Prepare slides for Monday standup",
        projectId: work.id,
        priority: 5,
        estimateMinutes: 60,
        status: "OPEN",
      },
      {
        title: "Call plumber about kitchen leak",
        projectId: personal.id,
        priority: 4,
        estimateMinutes: 15,
        status: "OPEN",
      },
    ],
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
