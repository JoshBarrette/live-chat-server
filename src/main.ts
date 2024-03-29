import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SocketAdapter } from "./adapters/SocketAdapter";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  // Need these 2 lines for CORS
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.enableCors({ origin: process.env.FRONT_END_URL, credentials: true }); // Prob don't need but w/e

  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
