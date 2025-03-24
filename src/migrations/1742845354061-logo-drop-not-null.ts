import { MigrationInterface, QueryRunner } from 'typeorm';

export class logoDropNotNull1742845354061 implements MigrationInterface {
  name = ' logoDropNotNull1742845354061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "logoUrl" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "logoUrl" SET NOT NULL`,
    );
  }
}
