import App from "./config/app.config";
import connectDB from "./database";

class Server {
    private server: App;

    constructor() {
        this.server = new App();
        this.server.listen(5000);
        connectDB();
    }
}

new Server();
