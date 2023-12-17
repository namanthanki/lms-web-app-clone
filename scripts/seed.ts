const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Music" },
                { name: "Fitness" },
                { name: "Photography" },
                { name: "Engineering" },
                { name: "Arts" },
                { name: "Politics" },
                { name: "Law" },
                { name: "Accounting" },
                { name: "Filming" },
            ]
        });

        console.log("Success Seeding the Data")
    } catch (error) {
        console.log("Error Seeding the Data into category Table", error);
    } finally {
        await db.$disconnect();
    }
}

main();