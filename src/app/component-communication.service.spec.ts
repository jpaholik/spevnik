import { TestBed, inject } from '@angular/core/testing';

import { ComponentCommunicationService } from './component-communication.service';

describe('ComponentCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComponentCommunicationService]
    });
  });

  it('should ...', inject([ComponentCommunicationService], (service: ComponentCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
