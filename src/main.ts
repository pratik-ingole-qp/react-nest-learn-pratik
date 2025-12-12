import { NestFactory } from '@nestjs/core'
import { AppModule } from './AppModule'
import { runSharedInitializationWithTest } from './sharedAppInitializationWithTests'
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  await runSharedInitializationWithTest(app)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()