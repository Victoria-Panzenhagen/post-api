import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserToPost1783911514647 implements MigrationInterface {
  name = 'AddUserToPost1783911514647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "UQ_e28aa0c4114146bfb1567bfa9ac"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "UQ_e28aa0c4114146bfb1567bfa9ac" UNIQUE ("title")`,
    );
  }
}
