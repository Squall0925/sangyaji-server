import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule } from './common/prisma.module'
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { ProjectModule } from './modules/project/project.module'
import { StageModule } from './modules/stage/stage.module'
import { TaskModule } from './modules/task/task.module'
import { RecordModule } from './modules/record/record.module'
import { DiaryModule } from './modules/diary/diary.module'
import { ReminderModule } from './modules/reminder/reminder.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProjectModule,
    StageModule,
    TaskModule,
    RecordModule,
    DiaryModule,
    ReminderModule,
    SubscriptionModule,
  ],
  providers: [
    // 全局 JWT 守卫 — 所有接口默认需要认证，@Public() 标记的接口除外
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
