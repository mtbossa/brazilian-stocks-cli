import { Stock } from "@data/models/stock";
import { StockWithRank } from "./models/stock-with-rank";
import stocksToRemove from "./stocks-to-remove";

type Ticker = string;
type StocksByTicker = Map<Ticker, StockWithRank>;
type AvailableColumns = keyof StockWithRank;

class MagicFormula {
    private readonly defaultColumnsToShow: AvailableColumns[] = [
        "ticker",
        "rankMagicFormula",
        "rankEV_EBIT",
        "rankROIC",
        "ev_Ebit",
        "roic",
        "currentPrice",
        "liquidezCorrente",
        "shouldExclude",
        "setor",
        "subsetor",
        "segmento",
    ];

    private stocksByTicker: StocksByTicker = new Map([]);
    private columnsToShow: AvailableColumns[] = this.defaultColumnsToShow;

    calculate(stocks: Stock[]) {
        const filtered = stocks.filter((stock) => stock.roic && stock.ev_Ebit);
        this.stocksByTicker = this.mapStocksByTicker(filtered);
        this.rankEV_EBIT();
        this.rankROIC();

        const result = this.rankMagicFormula();

        this.reset();

        return result;
    }

    setColumnsToShow(columnsToShow: AvailableColumns[]) {
        this.columnsToShow = columnsToShow;

        return this;
    }

    private mapStocksByTicker(stocks: Stock[]): StocksByTicker {
        return new Map<string, StockWithRank>(
            stocks.map((stock) => [
                stock.ticker,
                new StockWithRank(stock, {
                    shouldExclude: this.shouldExclude(stock),
                    rankMagicFormula: 0,
                    rankEV_EBIT: 0,
                    rankROIC: 0,
                }),
            ])
        );
    }

    private rankEV_EBIT() {
        const sorted = [...this.stocksByTicker.values()].sort((a, b) => a.ev_Ebit - b.ev_Ebit);
        sorted.forEach((stock, index) => {
            stock.rankEV_EBIT = index + 1;
            this.stocksByTicker.set(stock.ticker, stock);
        });
    }

    private rankROIC() {
        const sorted = [...this.stocksByTicker.values()].sort((a, b) => b.roic - a.roic);
        sorted.forEach((stock, index) => {
            stock.rankROIC = index + 1;
            this.stocksByTicker.set(stock.ticker, stock);
        });
    }

    private rankMagicFormula() {
        return [...this.stocksByTicker.values()].sort((a, b) => {
            const rankA = a.rankEV_EBIT + a.rankROIC;
            const rankB = b.rankEV_EBIT + b.rankROIC;

            // We do it here so we don't have to reiterate over the array
            // to add the rankMagicFormula property and remove the unwanted columns
            a.rankMagicFormula = rankA;
            b.rankMagicFormula = rankB;

            this.removeUnwantedColumns(a);
            this.removeUnwantedColumns(b);

            return rankA - rankB;
        });
    }

    private shouldExclude(stock: Stock) {
        const badSector = stocksToRemove.some((exclude) => stock.ticker.includes(exclude));
        const badEvEbit = !stock.ev_Ebit || stock.ev_Ebit <= 0;
        const badRoic = !stock.roic || stock.roic <= 0;

        return badSector || badEvEbit || badRoic;
    }

    private removeUnwantedColumns(stock: StockWithRank) {
        Object.keys(stock).forEach((key) => {
            if (!this.columnsToShow.includes(key as keyof StockWithRank)) {
                delete stock[key as keyof StockWithRank];
            }
        });
    }

    private reset() {
        this.stocksByTicker = new Map([]);
        this.columnsToShow = this.defaultColumnsToShow;
    }
}

export default new MagicFormula();
