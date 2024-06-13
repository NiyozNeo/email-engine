// import { InjectDataSource } from "@nestjs/typeorm";
// import { DataSource, ILike } from "typeorm";


// import { Uuid } from "boilerplate.polyfill";
// import { ICurrentUser } from "interfaces/current-user.interface";

// import { BasicService } from "../../generic/service";

// import { CitiesEntity } from "./cities.entity";
// import { CreateCitiesDto } from "./dtos/create-cities.dto";
// import { UpdateCitiesDto } from "./dtos/update-cities.dto";
// import { CityNotFoundError } from "./errors/CityNotFound.error";

// export class CitiesService extends BasicService<
// 	CitiesEntity,
// 	CreateCitiesDto,
// 	UpdateCitiesDto
// > {
// 	constructor(@InjectDataSource() dataSource: DataSource) {
// 		super("cities", CitiesEntity, dataSource);
// 	}

// 	async findAllWithName(name: string): Promise<CitiesEntity[]> {
// 		const cities = await this.repository.find({
// 			where: {
// 				name: ILike(`%${name}%`),
// 			},
// 		});
// 		if (!cities.length) {
// 			throw new CityNotFoundError(`'${name}' city not found`);
// 		}
// 		return cities;
// 	}

// 	async r_findOne(id: Uuid): Promise<CitiesEntity> {
// 		const findOne = await this.repository.findOne({
// 			where: { id },
// 		});

// 		if (!findOne) {
// 			throw new CityNotFoundError(`'${id}' city not found`);
// 		}

// 		return findOne;
// 	}

// 	async r_update(
// 		id: Uuid, // Assuming UUID is a string
// 		dto: UpdateCitiesDto,
// 		currentUser?: ICurrentUser,
// 	): Promise<CitiesEntity[]> {
// 		const foundCity = await this.r_findOne(id);

// 		if (!foundCity) {
// 			throw new CityNotFoundError("city not found");
// 		}

// 		Object.assign(foundCity, dto, {
// 			updatedAt: new Date(),
// 			updatedBy: currentUser?.user_id,
// 		});

// 		const updatedData = await this.repository.save(foundCity);

// 		return [updatedData];
// 	}

// 	async r_remove(id: string): Promise<CitiesEntity[]> {
// 		const foundCity = await this.r_findOne(id);
// 		await this.repository.delete(id);
// 		return [foundCity];
// 	}
// }
