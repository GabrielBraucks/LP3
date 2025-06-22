import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn }
    from "typeorm";

import Usuário from "./usuário";
import Interesse from "./interesse";

export enum RendaMensal { ATE2 = "até_2_salarios", DE2A5 = "de_2_a_5_salarios", ACIMADE5 = "acima_5_salarios" };

@Entity()
export default class Locatário extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "enum", enum: RendaMensal })
    renda_mensal: RendaMensal;
    @Column()
    telefone: string;
    @OneToMany(() => Interesse, (interesse) => interesse.locatário)
    interesses: Interesse[];
    @OneToOne(() => Usuário, usuário => usuário.locatário, { onDelete: "CASCADE" })
    @JoinColumn()
    usuário: Usuário;
}
