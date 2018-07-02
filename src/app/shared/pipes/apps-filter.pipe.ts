import { Pipe, PipeTransform } from '@angular/core';

// interfaces
import { AppItem } from '../interface/applications.model';

@Pipe({
  name: 'appsFilter'
})
export class AppsFilterPipe implements PipeTransform {
  transform(apps: AppItem[], showHidden: boolean) {
    if (!apps) {
      return apps;
    }
    return apps.filter(app => app.Visible || showHidden);
  }
}
