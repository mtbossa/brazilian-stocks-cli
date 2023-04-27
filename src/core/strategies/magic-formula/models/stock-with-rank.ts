import { Stock } from "src/data/models/stock";

interface StockWithRankParams {
    rankEV_EBIT: number;
    rankROIC: number;
    rankMagicFormula: number;
    shouldExclude: boolean;
}

export class StockWithRank extends Stock {
    rankEV_EBIT = 0;
    rankROIC = 0;
    rankMagicFormula = 0;
    shouldExclude = false;

    constructor(stock: Stock, rankParams?: StockWithRankParams) {
        super(stock);
        Object.assign(this, rankParams);
    }
}
