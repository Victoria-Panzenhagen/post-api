import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it('should hash and compare a valid password', async () => {
    const hash = await service.hash('senha123');

    await expect(service.compare('senha123', hash)).resolves.toBe(true);
  });

  it('should reject an invalid password', async () => {
    const hash = await service.hash('senha123');

    await expect(service.compare('outra-senha', hash)).resolves.toBe(false);
  });
});
