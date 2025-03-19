import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import Locador from "./locador";
import Interesse from "./interesse";

export enum Categoria { APARTAMENTO = "Apartamento", CASA = "Casa", KITNET = "Kitnet", LOFT = "Loft" };

@Entity()
export default class Proposta extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    título: string;
    @Column({ type: "enum", enum: Categoria })
    categoria: Categoria;
    @Column()
    localização: string;
    @Column()
    valor_aluguel: number;
    @Column({ type: "date" })
    data_disponibilidade: Date;
    @Column()
    descrição: string;
    @Column()
    mobiliado: boolean;
    @ManyToOne(() => Locador, (locador) => locador.residências, { onDelete: "CASCADE" })
    locador: Locador;
    @OneToMany(() => Interesse, (interesse) => interesse.residência)
    interesses: Interesse[];
}