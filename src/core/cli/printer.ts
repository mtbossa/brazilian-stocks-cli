import { print_new_line } from "@helpers/new_line";
import * as Table from "table";

class Printer {
    private currentPage = 1;
    private amountPerPage = 10;

    public printTable(headers: string[], rows: string[][], table_config: Table.StreamUserConfig) {
        const stream = Table.createStream(table_config);
        stream.write(headers);

        const rowsPerPage = rows.slice(
            (this.currentPage - 1) * this.amountPerPage,
            this.amountPerPage * this.currentPage
        );

        for (const row of rowsPerPage) {
            stream.write(row);
        }

        print_new_line();
    }
}

export const printer = new Printer();
