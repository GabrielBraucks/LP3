import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from
    "typeorm";

import Locatário from "./locatário";
import Residência from "./residência";

@Entity()
export default class Interesse extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    valor_proposto: boolean;
    @Column()
    justificativa: string;
    @CreateDateColumn()
    data_manifestação: Date;
    @ManyToOne(() => Residência, (residência) => residência.interesses, { onDelete: "CASCADE" })
    residência: Residência;
    @ManyToOne(() => Locatário, (locatário) => locatário.interesses, { onDelete: "CASCADE" })
    locatário: Locatário;
}
