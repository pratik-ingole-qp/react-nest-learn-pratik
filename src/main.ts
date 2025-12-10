import {NestFactory} from '@nestjs/core'
import {AppModule} from './AppModule'
import {ValidationPipe} from '@nestjs/common'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())

  const port = process.env.PORT || 3350
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
}
bootstrap()
