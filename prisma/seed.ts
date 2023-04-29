import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.sector.create({
        data: {
            name: "Petróleo, Gás e Biocombustíveis",
            subsectors: {
                create: [
                    {
                        name: "Petróleo, Gás e Biocombustíveis",
                        segments: {
                            create: [
                                {
                                    name: "Exploração, Refino e Distribuição",
                                    companies: {
                                        create: [
                                            {
                                                code: "RRRP",
                                            },
                                            {
                                                code: "CSAN",
                                            },
                                            {
                                                code: "DMMO",
                                            },
                                            {
                                                code: "ENAT",
                                            },
                                            {
                                                code: "RPMG",
                                            },
                                            {
                                                code: "PETR",
                                            },
                                            {
                                                code: "RECV",
                                            },
                                            {
                                                code: "PRIO",
                                            },
                                            {
                                                code: "UGPA",
                                            },
                                            {
                                                code: "VBBR",
                                            },
                                        ],
                                    },
                                },
                                {
                                    name: "Equipamentos e Serviços",
                                    companies: {
                                        create: [
                                            {
                                                code: "LUPA",
                                            },
                                            {
                                                code: "OPCT",
                                            },
                                            {
                                                code: "OSXB",
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
