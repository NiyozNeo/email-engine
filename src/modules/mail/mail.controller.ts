import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { IUser } from 'src/common/interface/user.interface';
import { User } from 'src/common/decorators/user.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @UseGuards(AuthGuard('azure_ad_oidc'))
  async sendEmail(@User() user: IUser, @Res() res: Response, @Body() body: any): Promise<void> {
    const { recipient, subject, content } = body;
    const accessToken = user.accessToken;
    await this.mailService.sendEmail(accessToken, recipient, subject, content);
    res.send('Email sent!');
  }
}
