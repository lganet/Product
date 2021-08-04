export class ServiceResponse {
    constructor(data, message, code, status) {
        this.data = data;
        this.message = message;
        this.code = code;
        this.status = status;
    };
}