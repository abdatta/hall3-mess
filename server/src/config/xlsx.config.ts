import XLSX from 'xlsx';

export class XLSXConfig {

    public static configure(data: object[], keysOrder?: KeysOrder) {
        return new NestedJsonToAoa(data, keysOrder);
    }

}

export class NestedJsonToAoa {

    aoa: string[][];
    private _merges: XLSX.Range[];
    private dimensions: any;
    private maxDepth: number;

    constructor(data: object[], keysOrder?: KeysOrder) {
        const dataMap = {};
        data.forEach(d => this.mapDataTo(dataMap, d));
        this._merges = [];
        this.dimensions = {};
        this.maxDepth = 0;
        this.getLength(dataMap, this.dimensions);
        this.aoa = new Array(this.maxDepth + data.length).fill('').map(_ => new Array(this.dimensions.length).fill(''));
        this.setHeaders(dataMap, keysOrder);
        this.fillData(data);
    }

    public merges(r: number, c: number) {
        return this._merges.map(m => ({s: {r: m.s.r + r, c: m.s.c + c}, e: {r: m.e.r + r, c: m.e.c + c}}));
    }

    private fillData(data: any[]) {
        data.forEach((d, i) => {
            i += this.maxDepth;
            this.aoa[i].forEach((_, j) => {
                this.aoa[i][j] = this.getValue(d, j);
            });
        });
    }

    private getValue(data: any, j: number): string {
        for (let i = 0; i < this.maxDepth; i++) {
            if (!this.isObject(data[this.aoa[i][j]])) {
                return (data[this.aoa[i][j]] != null) ? data[this.aoa[i][j]] : '';
            }
            data = data[this.aoa[i][j]];
        }
        return data || '';
    }

    private mapDataTo(dataMap: any, data: any) {
        Object.keys(data).forEach(key => {
            if (this.isObject(data[key]) && dataMap[key] && this.isObject(dataMap[key])) {
                this.mapDataTo(dataMap[key], data[key]);
                return;
            }
            dataMap[key] = JSON.parse(JSON.stringify(data[key]));
        });
    }

    private setHeaders(data: any, keysOrder?: KeysOrder, i = 0, j = 0, dim = this.dimensions.data) {
        ((keysOrder && keysOrder.keys) || Object.keys(data)).forEach(key => {
            if (this.isObject(data[key])) {
                this.setHeaders(data[key], keysOrder && keysOrder.nested && keysOrder.nested[key], i + 1, j, dim[key].data);
            }
            if (dim[key].length > 1) {
                this._merges.push({s: {r: i, c: j}, e: {r: i, c: j + dim[key].length - 1}});
            }
            if (!this.isObject(data[key]) && dim[key].depth < this.maxDepth) {
                this._merges.push({s: {r: i, c: j}, e: {r: i + this.maxDepth - dim[key].depth, c: j}});
            }
            for (let k = 0; k < dim[key].length; k++) {
                this.aoa[i][j++] = key;
            }
        });
    }

    private getLength(data: any, dimensions: any, depth = 0): number {
        if (depth > this.maxDepth) {
            this.maxDepth = depth;
        }

        dimensions.depth = depth;
        if (!this.isObject(data)) {
            dimensions.data = data;
            dimensions.length = 1;
            return 1;
        }

        let len = 0;
        dimensions.data = {};
        Object.keys(data).forEach(key => {
            dimensions.data[key] = {};
            len += this.getLength(data[key], dimensions.data[key], depth + 1);
        });

        dimensions.length = len;
        return len;
    }

    private isObject(data: any) {
        return (data !== undefined && data !== null && data.constructor === {}.constructor);
    }
}

interface KeysOrder {
    keys: string[];
    nested?: any;
}
