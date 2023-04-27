import { Stock } from "models/stock";

export abstract class Parser<T> {
    abstract parse(from: T): Stock;
}
