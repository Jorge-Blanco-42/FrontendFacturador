import { TestBed } from '@angular/core/testing';

import { CrearNotaService } from './crear-nota.service';

describe('CrearNotaService', () => {
  let service: CrearNotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearNotaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
