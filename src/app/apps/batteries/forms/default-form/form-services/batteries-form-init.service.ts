import { Injectable } from "@angular/core";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";

// services
import { ValidationService } from "../../../../../shared/validators/validation.service";

// interfaces
import { FormMode } from "../../../../../shared/interface/form.model";
import { BatteryItem } from "../../../../../shared/interface/batteries.model";

// constants
import { ApiPath, PathSlbSp } from "../../../../../shared/constants";

@Injectable()
export class BatteriesFormInitService {
  constructor(private fb: FormBuilder) {}

  create_FormGroup_Fields(mo: FormMode, it: BatteryItem, lo: number) {
    return this.fb.group({
      Serial: [this.getSimpleFormValue(mo, it, "Serial")],
      PN: [this.getSimpleFormValue(mo, it, "PN")],
      ManufDate: [this.getDateValue(mo, it, "ManufDate")],
      Junked: [this.getSimpleFormValue(mo, it, "Junked")],
      Hours: [this.getSimpleFormValue(mo, it, "Hours")],
      Details: [this.getSimpleFormValue(mo, it, "Details")],
      LocationId: [this.getLocation(mo, it, lo), [Validators.required]]
    });
  }

  // get field value & condition
  getSimpleFormValue(mode: FormMode, item: BatteryItem, field: string) {
    switch (mode) {
      case "new":
        return "";
      case "view":
        return { value: item[field], disabled: true };
      case "edit":
        return { value: item[field], disabled: false };
    }
  }

  // get date field value (today)
  getDateValue(mode: FormMode, item: BatteryItem, field: string) {
    const fieldName = item[field];
    switch (mode) {
      case "new":
        return { value: new Date(), disabled: true };
      case "view":
        return { value: new Date(fieldName), disabled: true };
      case "edit":
        return { value: new Date(fieldName), disabled: false };
    }
  }

  getLocation(mode: FormMode, item: BatteryItem, locationId: number) {
    switch (mode) {
      case "new":
        return locationId; // Default location is locationAssignedId
      case "view":
        return item.LocationId;
      case "edit":
        return item.LocationId;
    }
  }
}
