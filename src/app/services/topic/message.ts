export class Message {
    private _payload: any;

    constructor(payload: any) {
        this._payload = payload;
    }

    public get payload(): any {
        return this._payload;
    }
}