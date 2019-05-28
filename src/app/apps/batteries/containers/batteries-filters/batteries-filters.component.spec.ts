import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteriesFiltersComponent } from './batteries-filters.component';

describe('BatteriesFiltersComponent', () => {
  let component: BatteriesFiltersComponent;
  let fixture: ComponentFixture<BatteriesFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteriesFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteriesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
