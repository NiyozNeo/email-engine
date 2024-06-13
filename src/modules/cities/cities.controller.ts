// import {
// 	Body,
// 	Controller,
// 	Delete,
// 	Get,
// 	HttpStatus,
// 	Post,
// 	Put,
// 	Query,
// } from "@nestjs/common";
// import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

// import { Uuid } from "boilerplate.polyfill";

// import { BaseDto } from "../../common/base/base_dto";
// import { UUIDParam } from "../../decorators";
// import { UserEntity } from "../../modules/user/user.entity";

// import { CitiesEntity } from "./cities.entity";
// import { CitiesService } from "./cities.service";
// import { CreateCitiesMetaDataDto } from "./dtos/create-cities.dto";
// import { UpdateCitiesMetaDataDto } from "./dtos/update-cities.dto";
// import { CityNotFoundError } from "./errors/CityNotFound.error";

// @ApiTags("Cities")
// @Controller("/cities")
// export class CitiesController {
// 	constructor(private service: CitiesService) {}

// 	// -------------------------------@Post()-----------------------------------
// 	@ApiOperation({ summary: "Create a city" })
// 	@ApiResponse({
// 		status: HttpStatus.CREATED,
// 		schema: {
// 			example: BaseDto.createFromDto(new BaseDto(), [
// 				CitiesEntity.toDto({ name: "..." }),
// 			]),
// 		},
// 	})
// 	@Post()
// 	createCity(@Body() createCitiesDto: CreateCitiesMetaDataDto) {
// 		const dto = createCitiesDto.data[0]; // Only one item comes
// 		return this.service.create(dto);
// 	}
// 	// ------------------------------@Get()-------------------------------------

// 	@ApiQuery({
// 		name: "name",
// 		description: " city Name (optional if not provided  or empty)",
// 		required: false,
// 	})
// 	@ApiOperation({ summary: "Get all cities" })
// 	@ApiResponse({
// 		status: HttpStatus.OK,
// 		schema: {
// 			example: BaseDto.createFromDto(new BaseDto(), [
// 				CitiesEntity.toDto({
// 					name: "...",
// 					users: [UserEntity.toDto({})],
// 				}),
// 			]),
// 		},
// 	})
// 	@Get()
// 	@ApiResponse({
// 		status: new CityNotFoundError().status,
// 		schema: {
// 			example: BaseDto.createFromDto(new BaseDto()).setPrompt(
// 				new CityNotFoundError("'name' city not found"),
// 			),
// 		},
// 	})
// 	async getCities(@Query("name") name: string) {
// 		const metaData = BaseDto.createFromDto(new BaseDto());
// 		if (name && name.length) {
// 			metaData.data = await this.service.findAllWithName(name);
// 			return metaData;
// 		} else {
// 			metaData.data = await this.service.r_findAll();
// 			return metaData;
// 		}
// 	}
// 	// ----------------------------@Get(":id")----------------------------------
// 	@ApiOperation({ summary: "Get a single city by ID" })
// 	@ApiResponse({
// 		status: HttpStatus.OK,
// 		schema: {
// 			example: BaseDto.createFromDto(new BaseDto(), [
// 				CitiesEntity.toDto({
// 					name: "...",
// 					users: [UserEntity.toDto({})],
// 				}),
// 			]),
// 		},
// 	})
// 	@ApiResponse({
// 		status: new CityNotFoundError().status,
// 		schema: {
// 			example: BaseDto.createFromDto(new BaseDto()).setPrompt(
// 				new CityNotFoundError("'name' city not found"),
// 			),
// 		},
// 	})
// 	@Get(":id")
// 	async getSingleCity(
// 		@UUIDParam("id")
// 		id: Uuid,
// 	) {
// 		const metaData = BaseDto.createFromDto(new BaseDto());
// 		const foundCity = await this.service.r_findOne(id);
// 		metaData.data = [foundCity];
// 		return metaData;
// 	}
// 	// ---------------------------@Put(":id")-----------------------------------
// 	@ApiOperation({ summary: "Update a city by ID" })
// 	@ApiResponse({
// 		status: HttpStatus.OK,
// 		schema: {
// 			example: BaseDto.createFromDto(new BaseDto(), [
// 				CitiesEntity.toDto({
// 					name: "...",
// 					users: [UserEntity.toDto({})],
// 				}),
// 			]),
// 		},
// 	})
// 	@Put(":id")
// 	async updateCity(
// 		@UUIDParam("id") id: Uuid,
// 		@Body() updateCitiesDto: UpdateCitiesMetaDataDto,
// 	) {
// 		const metaData = BaseDto.createFromDto(new BaseDto());
// 		const dto = updateCitiesDto.data[0]; // Only one item comes
// 		const updatedCity = await this.service.r_update(id, dto);
// 		metaData.data = updatedCity;
// 		return metaData;
// 	}
// 	// ---------------------------@Delete(":id")-------------------------------
// 	@ApiOperation({ summary: "Delete a city by ID" })
// 	@ApiResponse({
// 		status: HttpStatus.OK,
// 		schema: {
// 			example: BaseDto.createFromDto(new BaseDto(), [
// 				CitiesEntity.toDto({
// 					name: "...",
// 					users: [UserEntity.toDto({})],
// 				}),
// 			]),
// 		},
// 	})
// 	@Delete(":id")
// 	async deleteCity(@UUIDParam("id") id: Uuid) {
// 		const metaData = BaseDto.createFromDto(new BaseDto());
// 		metaData.data = await this.service.r_remove(id);
// 		return metaData;
// 	}
// 	// -----------------------------------------------------------------------
// }
