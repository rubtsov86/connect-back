import { MigrationInterface, QueryRunner } from 'typeorm';

export class tokenUser1742753422187 implements MigrationInterface {
  name = ' tokenUser1742753422187';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "token" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "expired_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "token"`);
  }
}
