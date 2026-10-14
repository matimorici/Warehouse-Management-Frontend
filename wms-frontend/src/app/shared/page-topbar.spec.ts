import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PageTopbarComponent } from './page-topbar';

describe('PageTopbarComponent', () => {
  let component: PageTopbarComponent;
  let fixture: ComponentFixture<PageTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageTopbarComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PageTopbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
