import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn }
    from "typeorm";

import Usuário from "./usuário";
import Interesse from "./interesse";

@Entity()
export default class Locatário extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    renda_mensal: number;
    @Column()
    telefone: string;
    @OneToMany(() => Interesse, (interesse) => interesse.locatário)
    interesses: Interesse[];
    @OneToOne(() => Usuário, usuário => usuário.locatário, { onDelete: "CASCADE" })
    @JoinColumn()
    usuário: Usuário;
}
