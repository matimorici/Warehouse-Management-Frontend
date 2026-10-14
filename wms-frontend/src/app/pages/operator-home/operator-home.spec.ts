import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { OperatorHomeComponent } from './operator-home';

describe('OperatorHomeComponent', () => {
  let component: OperatorHomeComponent;
  let fixture: ComponentFixture<OperatorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorHomeComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
