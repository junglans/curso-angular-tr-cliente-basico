export class Message {
    private _senderId:string;
    private _payload: any;

    constructor(senderId: string, payload: any) {

        this._senderId = senderId;
        this._payload = payload;

    }

    public get senderId(): string {
        return this._senderId;
    }

    public get payload(): any {
        return this._payload;
    }
}