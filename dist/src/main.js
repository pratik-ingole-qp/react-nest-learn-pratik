"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const AppModule_1 = require("./AppModule");
const sharedAppInitializationWithTests_1 = require("./sharedAppInitializationWithTests");
async function bootstrap() {
    const app = await core_1.NestFactory.create(AppModule_1.AppModule);
    await (0, sharedAppInitializationWithTests_1.runSharedInitializationWithTest)(app);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map