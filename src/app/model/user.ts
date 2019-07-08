export class User {
    public username: string = 'no-name';
    public room: string = 'no-room';
    public id: string;
    constructor(username: string, room : string, id : string) {
        this.username = username;
        this.room = room;
        this.id = id;
    }
    
    
}