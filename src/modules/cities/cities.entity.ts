// import { Column, Entity, OneToMany } from "typeorm";

// import { WithOutToDto } from "types";

// import { AbstractEntity } from "../../common/abstract.entity";
// import { UserEntity } from "../../modules/user/user.entity";

// @Entity({ name: "cities" })
// export class CitiesEntity extends AbstractEntity {
// 	@Column({ nullable: true, type: "varchar" })
// 	name!: string;

// 	@OneToMany(() => UserEntity, (user) => user.city)
// 	users?: WithOutToDto<UserEntity>[];

// 	static toDto(
// 		entity: Partial<WithOutToDto<CitiesEntity>>,
// 	): WithOutToDto<CitiesEntity> {
// 		const dto: WithOutToDto<CitiesEntity> = {
// 			id: entity.id ?? "",
// 			name: entity.name ?? "",
// 			users: entity.users ?? [],
// 			createdAt: entity.createdAt ?? new Date(),
// 			updatedAt: entity.updatedAt ?? new Date(),
// 		};
// 		return dto;
// 	}
// }
