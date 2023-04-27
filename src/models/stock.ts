type StockParams = {
    readonly ticker: string;
    readonly currentPrice: string;
    readonly ev_Ebit: number;
    readonly roic: number;
    readonly p_L?: number;
    readonly p_VP?: number;
    readonly p_Ebit?: number;
    readonly p_Ativo?: number;
    readonly companyName?: string;
    readonly volume2Months?: string;
    readonly liquidezCorrente?: number;
};

export class Stock {
    public readonly ticker: string;
    public readonly currentPrice: string;
    public readonly ev_Ebit: number;
    public readonly roic: number;
    public readonly p_L?: number;
    public readonly p_VP?: number;
    public readonly p_Ebit?: number;
    public readonly p_Ativo?: number;
    public readonly companyName?: string;
    public readonly volume2Months?: string;
    public readonly liquidezCorrente?: number;

    constructor(properties: StockParams) {
        this.ticker = properties.ticker;
        this.currentPrice = properties.currentPrice;
        this.p_L = properties.p_L;
        this.p_VP = properties.p_VP;
        this.p_Ebit = properties.p_Ebit;
        this.p_Ativo = properties.p_Ativo;
        this.ev_Ebit = properties.ev_Ebit;
        this.roic = properties.roic;
        this.companyName = properties.companyName;
        this.volume2Months = properties.volume2Months;
        this.liquidezCorrente = properties.liquidezCorrente;
    }
}
