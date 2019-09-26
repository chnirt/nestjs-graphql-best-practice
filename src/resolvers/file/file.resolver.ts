import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { File } from '../../models';
import { UploadService } from '../../utils/upload/upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

@Resolver('File')
export class FileResolver {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: MongoRepository<File>,
    private readonly uploadService: UploadService,
  ) {}

  @Query(() => [File])
  async files(): Promise<File[]> {
    return this.fileRepository.find({
      order: { createdAt: 'DESC' },
      cache: true,
    });
  }

  @Mutation(() => Boolean)
  async uploadFile(@Args('file') file): Promise<boolean> {
    const { filename, createReadStream } = file;

    const path = await this.uploadService.uploadFile(createReadStream);

    const newFile = new File();

    newFile.filename = filename;
    newFile.path = path;

    return (await this.fileRepository.save(newFile)) ? true : false;
  }
}
