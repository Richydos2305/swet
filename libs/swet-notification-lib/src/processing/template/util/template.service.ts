import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { join } from 'path';
import { NotificationConfig } from '../../config/notification.config';

@Injectable()
export class TemplateService {
  private readonly compiled = new Map<string, Handlebars.TemplateDelegate>();

  constructor(private readonly notificationConfig: NotificationConfig) {}

  render(templateName: string, context: Record<string, unknown>): string {
    let template = this.compiled.get(templateName);

    if (!template) {
      const templatePath = join(
        this.notificationConfig.templatePath,
        `${templateName}.html`,
      );

      const source = readFileSync(templatePath, 'utf-8');

      template = Handlebars.compile(source);

      this.compiled.set(templateName, template);
    }

    return template(context);
  }
}
