import { IsUrl, IsNotEmpty } from 'class-validator';

export class SaveLinkDto {
  @IsUrl({}, { message: 'The link must be a valid URL' })
  @IsNotEmpty({ message: 'The link cannot be empty' })
  url: string;

  @IsNotEmpty({ message: 'The name cannot be empty' })
  name: string;
}
