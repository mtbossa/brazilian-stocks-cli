import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Scraper } from "scrapers/scraper";
import { Stock } from "models/stock";

interface Result {
    companyId: number;
    companyName: string;
    ticker: string;
    price: number;
    p_L: number;
    p_VP: number;
    p_Ebit: number;
    p_Ativo: number;
    eV_Ebit: number;
    margemBruta: number;
    margemEbit: number;
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
        puppeteer.use(StealthPlugin());
        const browser = await puppeteer.launch({
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

    parseToStock(data: Result): Stock {
        return new Stock({
            ticker: data.ticker,
            currentPrice: data.price.toString(),
            ev_Ebit: data.eV_Ebit,
            roic: data.roic,
            p_L: data.p_L,
            p_VP: data.p_VP,
            p_Ebit: data.p_Ebit,
            p_Ativo: data.p_Ativo,
            companyName: data.companyName,
            liquidezCorrente: data.liquidezCorrente,
        });
    }
}

export default new StatusInvestScraper();