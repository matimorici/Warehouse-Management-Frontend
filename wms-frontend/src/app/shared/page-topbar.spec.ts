import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { PageTopbarComponent } from './page-topbar';

describe('PageTopbarComponent', () => {
  let component: PageTopbarComponent;
  let fixture: ComponentFixture<PageTopbarComponent>;
  let authService: {
    getUserRole: ReturnType<typeof vi.fn>;
    getHomeRouteByRole: ReturnType<typeof vi.fn>;
    getCurrentUserName: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
    clearSession: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = {
      getUserRole: vi.fn(() => null),
      getHomeRouteByRole: vi.fn(() => '/login'),
      getCurrentUserName: vi.fn(() => ''),
      logout: vi.fn(() => of(void 0)),
      clearSession: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PageTopbarComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageTopbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('shows the saved name and a readable admin role', () => {
    authService.getCurrentUserName.mockReturnValue('Ana García');
    authService.getUserRole.mockReturnValue('ADMIN');
    fixture.detectChanges();

    const identity = fixture.nativeElement.querySelector('.wms-session-identity');
    expect(identity.textContent).toContain('Ana García');
    expect(identity.textContent).toContain('Administrador');
  });

  it('uses a name fallback and shows the operator role', () => {
    authService.getUserRole.mockReturnValue('OPERARIO');
    fixture.detectChanges();

    const identity = fixture.nativeElement.querySelector('.wms-session-identity');
    expect(identity.textContent).toContain('Usuario');
    expect(identity.textContent).toContain('Operario');
  });
});
