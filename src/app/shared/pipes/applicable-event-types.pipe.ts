import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

// interfaces
import { TimelineEventType } from '../interface/timeline.model';

@Pipe({
  name: 'applicableEventTypes'
})
export class ApplicableEventTypesPipe implements PipeTransform {
  transform(eventTypes: TimelineEventType[], locationAssignedId: number) {
    if (!eventTypes) {
      return eventTypes;
    }
    return eventTypes.filter(eventType => {

        // iterate over ApplicableTo array and look
        // if its ID is equal to locationAssignedId
        const result = _.find(eventType.ApplicableTo, { ID: locationAssignedId });

        if (result) {
            return true;
        } else {
            return false;
        }

    });
  }
}
