import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LosspasswordPage } from './losspassword.page';

describe('LosspasswordPage', () => {
  let component: LosspasswordPage;
  let fixture: ComponentFixture<LosspasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LosspasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
