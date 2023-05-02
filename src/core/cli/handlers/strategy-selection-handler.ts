import prompts from "prompts";
import { Spinner } from "cli-spinner";
import chalk from "chalk";

import { exit } from "@helpers/exit";
import statusInvest from "@data/scrapers/status-invest/status-invest";
import magicFormula from "@core/strategies/magic-formula/magic-formula";
import config from "@config";
import { Stock } from "@data/models/stock";
import * as Table from "table";
import { printer } from "../printer";
import { PromptName } from "../prompts/strategy-selection/prompt-name";
import { Choices } from "../prompts/strategy-selection";

export const strategySelectionHandler = async (answers: prompts.Answers<PromptName.Name>) => {
    switch (answers[PromptName.Name]) {
        case Choices.MagicFormula: {
            const spinner = new Spinner(
                `${chalk.blue.bold("%s")} Calculando ranking da ${chalk.green.bold(
                    "Magic Formula"
                )}...`
            );
            spinner.setSpinnerString(config.spinnerId);
            spinner.start();

            const result = await statusInvest.scrape();

            const stocks: Stock[] = [];

            for (const stock of result) {
                const parsed = await statusInvest.parseToStock(stock);
                stocks.push(parsed);
            }

            const ranked = magicFormula.calculate(stocks);

            spinner.stop(true);

            const headers = [
                "Ticker",
                "Preço",
                "EV/EBIT",
                "Rank EV/EBIT",
                "ROIC",
                "Rank ROIC",
                "Rank Magic Formula",
                "Setor",
                "Subsetor",
                "Segmento",
                "Deve excluir?",
            ];
            const stream_config: Table.StreamUserConfig = {
                columnDefault: {
                    width: 10,
                },
                columns: {
                    3: {
                        width: 5,
                    },
                    6: {
                        width: 5,
                    },
                    7: {
                        width: 20,
                    },
                    8: {
                        width: 20,
                    },
                    9: {
                        width: 20,
                    },
                    10: {
                        width: 5,
                    },
                },
                columnCount: headers.length,
            };

            await printer
                .resetLastSelectedChoice()
                .setHeaders(headers)
                .setTableConfig(stream_config)
                .setRows(
                    ranked.map((stock) => {
                        return [
                            String(stock.ticker),
                            String(stock.currentPrice),
                            String(stock.ev_Ebit),
                            String(stock.rankEV_EBIT),
                            String(stock.roic),
                            String(stock.rankROIC),
                            String(stock.rankMagicFormula),
                            String(stock.setor),
                            String(stock.subsetor),
                            String(stock.segmento),
                            String(stock.shouldExclude ? "Sim" : "Não"),
                        ];
                    })
                )
                .printTable();

            break;
        }
        default:
            exit();
            break;
    }
};
