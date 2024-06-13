import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { SyncService } from './sync.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { IUser } from 'src/common/interface/user.interface';
import { User } from 'src/common/decorators/user.decorator';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get()
  @UseGuards(AuthGuard('azure_ad_oidc'))
  async syncEmails(@User() user: IUser, @Res() res: Response): Promise<void> {
    const accessToken = user.accessToken;
    await this.syncService.syncEmails(accessToken);
    res.send('Emails synchronized!');
  }
}
