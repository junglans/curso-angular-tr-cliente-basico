export class User {
    private _username: string;

    constructor(username: string) {
        this._username = username;
    }
    
    public get username(): string {
        return this._username;
    }
}