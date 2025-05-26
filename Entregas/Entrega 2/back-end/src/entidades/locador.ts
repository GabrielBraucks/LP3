import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from
    "typeorm";

import Usuário from "./usuário";
import Residência from "./residência";

@Entity()
export default class Locador extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    anos_experiência: number;
    @Column()
    número_imóveis: number;
    @OneToMany(() => Residência, (residência) => residência.locador)
    residências: Residência[];
    @OneToOne(() => Usuário, (usuário) => usuário.locador, { onDelete: "CASCADE" })
    @JoinColumn()
    usuário: Usuário;
}
