import puppeteer from "puppeteer";
import { tableParser } from "puppeteer-table-parser";
import { Scraper } from "scrapers/scraper";
import { Stock } from "models/stock";

interface Result {
    ticker: string;
    current_price: string;
    ev_ebit: string;
    roic: string;
    volume_2_months: string;
}

class FundamentusScraper extends Scraper<Result> {
    async scrape() {
        const browser = await puppeteer.launch({
            args: ["--no-sandbox"],
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        await page.goto("https://www.fundamentus.com.br/buscaavancada.php");

        const element1 = await page.waitForSelector('input[name="roic_min"]');
        await element1.type("0.01");

        const element2 = await page.waitForSelector('input[name="firma_ebit_min"]');
        await element2.type("0.01");

        const element3 = await page.waitForSelector('input[name="liq_min"]');
        await element3.type("50000");

        // Query for an element handle.
        const element = await page.waitForSelector("input.buscar");
        // Do something with element...
        await element.click();

        await page.waitForNavigation();
        await page.waitForSelector("#resultado");
        await page.evaluate(() => document.querySelector("#resultado").scrollIntoView());

        const result: Result[] = await tableParser(page, {
            selector: "#resultado",
            asArray: true,
            rowValuesAsObject: true,
            allowedColNames: {
                Papel: "ticker",
                Cotação: "current_price",
                "EV/EBIT": "ev_ebit",
                ROIC: "roic",
                "Liq.2meses": "volume_2_months",
            },
        });

        await browser.close();
        return result;
    }

    public parseToStock(stock: Result) {
        return new Stock({
            ticker: stock.ticker,
            currentPrice: stock.current_price,
            ev_Ebit: this.parseEV_EBIT(stock.ev_ebit),
            roic: this.parseROIC(stock.roic),
            volume2Months: stock.volume_2_months,
        });
    }

    private parseEV_EBIT(ev_ebit: string): number {
        return Number(ev_ebit.replace(",", "."));
    }

    private parseROIC(roic: string): number {
        return Number(roic.replace(",", ".").replace("%", ""));
    }
}

export default new FundamentusScraper();
