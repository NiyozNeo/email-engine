// import { ApiProperty } from "@nestjs/swagger";
// import {
// 	ArrayMinSize,
// 	IsArray,
// 	IsString,
// 	ValidateNested,
// } from "class-validator";

// import { Type } from "class-transformer";
// import { BaseDto } from "../../../common/base/base_dto";

// export class CreateCitiesDto {
// 	@IsString()
// 	@ApiProperty({
// 		required: true,
// 		maxLength: 1000,
// 		minLength: 3,
// 	})
// 	name!: string;
// }

// export class CreateCitiesMetaDataDto extends BaseDto<CreateCitiesDto> {
// 	@ApiProperty({ default: [{ name: "moscow" } as CreateCitiesDto] })
// 	@IsArray()
// 	@ValidateNested({ each: true })
// 	@ArrayMinSize(1)
// 	@Type(() => CreateCitiesDto)
// 	declare data: CreateCitiesDto[];
// }
