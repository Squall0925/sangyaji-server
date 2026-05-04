import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())

  app.enableCors({
    origin: true,
    credentials: true,
  })

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`桑芽记后端服务启动: http://localhost:${port}`)
}

bootstrap()
