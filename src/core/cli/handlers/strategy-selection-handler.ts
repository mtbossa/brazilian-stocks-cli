import prompts from "prompts";
import { Spinner } from "cli-spinner";
import chalk from "chalk";

import { exit } from "@helpers/exit";
import { Choices } from "@core/cli/prompts/choices";
import { AvailableStrategies } from "@core/strategies/available-strategies";
import statusInvest from "@data/scrapers/status-invest/status-invest";
import magicFormula from "@core/strategies/magic-formula/magic-formula";
import config from "@config";
import { Stock } from "@data/models/stock";
import * as Table from "table";
import { printer } from "../printer";

export const strategySelectionHandler = async (answers: prompts.Answers<Choices.Strategy>) => {
    switch (answers[Choices.Strategy]) {
        case AvailableStrategies.MagicFormula: {
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

            const table_config: Table.TableUserConfig = {
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
            };

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

            // console.log(
            //     Table.table(
            //         [
            //             [
            //                 "Ticker",
            //                 "Preço",
            //                 "EV/EBIT",
            //                 "Rank EV/EBIT",
            //                 "ROIC",
            //                 "Rank ROIC",
            //                 "Rank Magic Formula",
            //                 "Setor",
            //                 "Subsetor",
            //                 "Segmento",
            //                 "Deve excluir?",
            //             ],
            //             ...ranked
            //                 .map((stock) => {
            //                     return [
            //                         stock.ticker,
            //                         stock.currentPrice,
            //                         stock.ev_Ebit,
            //                         stock.rankEV_EBIT,
            //                         stock.roic,
            //                         stock.rankROIC,
            //                         stock.rankMagicFormula,
            //                         stock.setor,
            //                         stock.subsetor,
            //                         stock.segmento,
            //                         stock.shouldExclude ? "Sim" : "Não",
            //                     ];
            //                 })
            //                 .reverse(),
            //         ],
            //         table_config
            //     )
            // );

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

            printer.printTable(
                headers,
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
                }),
                stream_config
            );

            break;
        }
        default:
            exit();
            break;
    }
};
