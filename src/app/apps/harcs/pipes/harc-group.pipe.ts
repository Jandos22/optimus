import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'harcGroup'})
export class HarcGroupPipe implements PipeTransform {
    transform(harcs: any[], filter: string): any {
        if (!harcs || !filter) {
            return harcs;
        }

        return harcs.filter(harc => {
            return harc.Group.indexOf(filter) !== -1;
        });
    }
}
