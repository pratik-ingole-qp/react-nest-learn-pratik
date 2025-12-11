'use strict'
Object.defineProperty(exports, '__esModule', {value: true})
const core_1 = require('@nestjs/core')
const AppModule_1 = require('./AppModule')
const common_1 = require('@nestjs/common')
async function bootstrap() {
  const app = await core_1.NestFactory.create(AppModule_1.AppModule)
  app.useGlobalPipes(new common_1.ValidationPipe())
  const port = process.env.PORT || 3350
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
}
bootstrap()
//# sourceMappingURL=main.js.map
