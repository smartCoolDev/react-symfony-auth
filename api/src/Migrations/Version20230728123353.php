<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230728123353 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(100) NOT NULL, password_hash VARCHAR(255) NOT NULL, role INT NOT NULL, status INT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, last_login_at DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET UTF8 COLLATE `UTF8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_token (uuid CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', user_id INT NOT NULL, type INT NOT NULL, comment VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, used_at DATETIME DEFAULT NULL, INDEX IDX_BDF55A63A76ED395 (user_id), PRIMARY KEY(uuid)) DEFAULT CHARACTER SET UTF8 COLLATE `UTF8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_token ADD CONSTRAINT FK_BDF55A63A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_token DROP FOREIGN KEY FK_BDF55A63A76ED395');
        $this->addSql('DROP TABLE `user`');
        $this->addSql('DROP TABLE user_token');
    }
}
