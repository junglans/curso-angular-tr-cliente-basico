export class Message {

    public from: string;
    public payload: any;

    constructor(from: string, payload: any) {
        this.from = from;
        this.payload = payload;
    }
}
