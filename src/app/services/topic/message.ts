export class Message {

    private _from: string;
    private _payload: any;

    constructor(from: string, payload: any) {
        this._from = from;
        this._payload = payload;
    }

    public get from(): string {
        return this._from;
    }
    public get payload(): any {
        return this._payload;
    }
}
