import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Scraper } from "../scraper";
import { Stock } from "@data/models/stock";
import { prismaClient } from "@data/db";
import scrapeResult from "./fixtures/result.json";
import { print_new_line } from "@helpers/new_line";

export interface Result {
    companyId: number;
    companyName: string;
    ticker: string;
    price: number;
    p_L: number;
    dy?: number;
    p_VP: number;
    p_Ebit: number;
    p_Ativo: number;
    eV_Ebit: number;
    margemBruta: number;
    margemEbit: number;
    peg_Ratio: number;
    receitas_Cagr5: number;
    lucros_Cagr5: number;
    liquidezMediaDiaria: number;
    margemLiquida: number;
    p_SR: number;
    p_CapitalGiro: number;
    p_AtivoCirculante: number;
    giroAtivos: number;
    roe: number;
    roa: number;
    roic: number;
    dividaliquidaPatrimonioLiquido: number;
    dividaLiquidaEbit: number;
    pl_Ativo: number;
    passivo_Ativo: number;
    liquidezCorrente: number;
    vpa: number;
    lpa: number;
    valorMercado: number;
}

class StatusInvestScraper extends Scraper<Result> {
    async scrape() {
        if (process.env.OFFLINE_MODE === "true") {
            print_new_line();
            console.log("Offline mode is on, using fixtures");
            return scrapeResult as Result[];
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

        const result: Result[] = await response.json();

        await browser.close();

        return result;
    }

    async parseToStock(data: Result): Promise<Stock> {
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
            ev_Ebit: data.eV_Ebit,
            roic: data.roic,
            p_L: data.p_L,
            p_VP: data.p_VP,
            p_Ebit: data.p_Ebit,
            p_Ativo: data.p_Ativo,
            companyName: data.companyName,
            liquidezCorrente: data.liquidezCorrente,
            segmento: company?.segment?.name,
            subsetor: company?.segment?.subsector?.name,
            setor: company?.segment?.subsector?.sector?.name,
        });
    }
}

export default new StatusInvestScraper();
