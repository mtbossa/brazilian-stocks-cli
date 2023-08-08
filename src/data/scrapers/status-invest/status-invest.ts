import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Scraper } from "../scraper";
import { Stock } from "@data/models/stock";
import { prismaClient } from "@data/db";
import scrapeResult from "./fixtures/result.json";
import { print_new_line } from "@helpers/new_line";
import { log } from "console";

type Data = {
    companyId: number;
    companyName: string;
    ticker: string;
    price: number;
    p_l: number;
    dy?: number;
    p_vp: number;
    p_ebit: number;
    p_ativo: number;
    ev_ebit: number;
    margebruta: number;
    margemebit: number;
    peg_ratio: number;
    receitas_cagr5: number;
    lucros_cagr5: number;
    liquidezmediadiaria: number;
    margemliquida: number;
    p_sr: number;
    p_capitalgiro: number;
    p_ativocirculante: number;
    giroativos: number;
    roe: number;
    roa: number;
    roic: number;
    dividaliquidapatrimonioliquido: number;
    dividajiquidaebit: number;
    pl_ativo: number;
    passivo_ativo: number;
    liquidezcorrente: number;
    vpa: number;
    lpa: number;
    valormercado: number;
};
export interface Result {
    list: Data[];
}

class StatusInvestScraper extends Scraper<Data> {
    async scrape() {
        if (process.env.OFFLINE_MODE === "true") {
            print_new_line();
            console.log("Offline mode is on, using fixtures");
            return scrapeResult.map((data) => ({
                ...data,
                dividajiquidaebit: 0,
                margebruta: 0,
                lucros_cagr5: 0,
            })) as Data[];
        }

        puppeteer.use(StealthPlugin());
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox"],
        });
        const page = await browser.newPage();
        await page.goto("https://statusinvest.com.br/acoes/busca-avancada");

        const element = await page.waitForSelector(
            '[data-tooltip="Clique para fazer a busca com base nos valores informados"]'
        );
        await element?.click();

        const response = await page.waitForResponse((response) =>
            response.url().includes("advancedsearchresult")
        );

        const result: Result = await response.json();

        await browser.close();

        return result.list;
    }

    async parseToStock(data: Data): Promise<Stock> {
        console.log({ data });
        const company = await prismaClient.company.findFirst({
            where: {
                code: {
                    startsWith: data.ticker.replace(/[0-9]/g, ""),
                },
            },
            include: {
                segment: {
                    include: {
                        subsector: {
                            include: {
                                sector: true,
                            },
                        },
                    },
                },
            },
        });

        return new Stock({
            ticker: data.ticker,
            currentPrice: `R$ ${data.price.toString()}`,
            ev_Ebit: data.ev_ebit,
            roic: data.roic,
            p_L: data.p_l,
            p_VP: data.p_vp,
            p_Ebit: data.p_ebit,
            p_Ativo: data.p_ativo,
            companyName: data.companyName,
            liquidezCorrente: data.liquidezcorrente,
            liquidezMediaDiaria: data.liquidezmediadiaria,
            segmento: company?.segment?.name,
            subsetor: company?.segment?.subsector?.name,
            setor: company?.segment?.subsector?.sector?.name,
        });
    }
}

export default new StatusInvestScraper();
