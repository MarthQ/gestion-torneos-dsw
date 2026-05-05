import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TournamentService } from '@services/tournament.service';

describe('TournamentService', () => {
  let service: TournamentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      TournamentService,
      provideHttpClient(),
      provideHttpClientTesting()
    ]
  });

  service = TestBed.inject(TournamentService);
  httpMock = TestBed.inject(HttpTestingController);
});

  afterEach(() => {
    httpMock.verify();
  });

  it('should include query param when query is provided', () => {
    service.getTournamentsPaginated('torneo', {}, 1, 10).subscribe();

    const req = httpMock.expectOne(r => r.url.includes('/tournaments'));
    expect(req.request.params.get('query')).toBe('torneo');
    req.flush({ data: [], meta: {}, message: '' });
  });

  it('should NOT include query param when query is empty', () => {
    service.getTournamentsPaginated('', {}, 1, 10).subscribe();

    const req = httpMock.expectOne(r => r.url.includes('/tournaments'));
    expect(req.request.params.get('query')).toBeNull();
    req.flush({ data: [], meta: {}, message: '' });
  });

  it('should always include page and pageSize params', () => {
    service.getTournamentsPaginated('', {}, 2, 5).subscribe();

    const req = httpMock.expectOne(r => r.url.includes('/tournaments'));
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('5');
    req.flush({ data: [], meta: {}, message: '' });
  });
});