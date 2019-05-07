import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryLastUpdatedComponent } from './battery-last-updated.component';

describe('BatteryLastUpdatedComponent', () => {
  let component: BatteryLastUpdatedComponent;
  let fixture: ComponentFixture<BatteryLastUpdatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryLastUpdatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryLastUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
