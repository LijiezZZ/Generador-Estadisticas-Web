export class User {
    uid: string;
    username: string;
    email: string;
    password: string;
    type: string;
    active: Boolean;
    charts: number[];

    constructor(uid: string, username: string, email: string, password: string, type: string, active: Boolean, charts: number[]) {
        this.uid = uid;
        this.username = username;
        this.email = email;
        this.password = password;
        this.type = type;
        this.active = active;
        this.charts = charts;
    }
}