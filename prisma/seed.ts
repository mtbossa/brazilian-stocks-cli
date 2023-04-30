import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ParsedStockWithSectors {
    NOME: string;
    CODIGO: string;
    SETOR: string;
    SUBSETOR: string;
    SEGMENTO: string;
}

const readStocksCSV = (): Promise<ParsedStockWithSectors[]> => {
    return new Promise((resolve, reject) => {
        const results: ParsedStockWithSectors[] = [];
        fs.createReadStream(path.resolve("./", "seeders", "brazilian_companies_by_sector.csv"))
            .pipe(csvParser({ separator: ";" }))
            .on("error", (err) => reject(err))
            .on("data", (data: ParsedStockWithSectors) => results.push(data))
            .on("end", () => {
                resolve(results);
            });
    });
};

async function main() {
    try {
        const result = await readStocksCSV();

        for (const stock of result) {
            const { CODIGO, NOME, SETOR, SUBSETOR, SEGMENTO } = stock;

            console.log(`Inserting ${CODIGO} - ${NOME} - ${SETOR} - ${SUBSETOR} - ${SEGMENTO}`);

            const sector = await prisma.sector.upsert({
                where: {
                    name: SETOR,
                },
                update: {},
                create: {
                    name: SETOR,
                },
            });

            const subsector = await prisma.subsector.upsert({
                where: { name: SUBSETOR },
                update: {},
                create: {
                    name: SUBSETOR,
                    sectorId: sector.id,
                },
            });

            const segment = await prisma.segment.upsert({
                where: { name: SEGMENTO },
                update: {},
                create: {
                    name: SEGMENTO,
                    subsectorId: subsector.id,
                },
            });

            await prisma.company.upsert({
                where: { code: CODIGO },
                update: {},
                create: {
                    code: CODIGO,
                    name: NOME,
                    segmentId: segment.id,
                },
            });
        }
    } catch (err) {
        console.error(err);
    }
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
