import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ItemEntity {

// * createdAt, updatedAt, deletedAt 가 없어도 괜찮을까요?

@IsNumber()
@IsNotEmpty()
itemId!: number

@IsString()
@IsNotEmpty()
name!: string

@IsNumber()
@IsNotEmpty()
prevPrice!: number

@IsNumber()
@IsNotEmpty()
price!: number

@IsNumber()
@IsNotEmpty()
count!: number

@IsDate()
@IsNotEmpty()
startTime!: Date

@IsDate()
@IsNotEmpty()
entTime!: Date

@IsString()
imgUrl!: number | null

@IsString()
@IsNotEmpty()
content!: string

@IsNumber()
@IsNotEmpty()
storeId!: number
}