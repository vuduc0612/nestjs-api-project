import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow('POSTGRES_HOST'),
                username: configService.getOrThrow('POSTGRES_USERNAME'),
                password: configService.getOrThrow('POSTGRES_PASSWORD'),
                database: configService.getOrThrow('POSTGRES_DATABASE'),
                port: configService.getOrThrow('POSTGRES_PORT'),
                autoLoadEntities: true,
                synchronize: true,

            }),
            inject: [ConfigService],
        })
    ]
})
export class DatabaseModule {}
