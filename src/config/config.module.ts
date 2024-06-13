// config.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JoiValidationPipe } from './joi-validation.pipe'; // Adjust path as per your file structure

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: JoiValidationPipe,
      validationOptions: {
        allowUnknown: true,
      },
    }),
  ],
})
export class CustomConfigModule {}
