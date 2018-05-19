import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExemptionsComponent } from './exemptions.component';

describe('ExemptionsComponent', () => {
  let component: ExemptionsComponent;
  let fixture: ComponentFixture<ExemptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExemptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
