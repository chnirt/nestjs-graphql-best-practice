import { Injectable } from '@nestjs/common'
import { getRepository, getMongoRepository } from 'typeorm'
import { ApolloError, UserInputError } from 'apollo-server-express'
import { Constants } from '../constants/constant.index'

@Injectable()
export class CommonService {
  async findAdapter(
    Entity: any,
    findCondition?: any,
    orderCondition?: any,
    limit?: any
  ): Promise<any> {
    try {
      if (findCondition && orderCondition && limit) {
        return await getMongoRepository(Entity).find({
          where: findCondition,
          order: orderCondition,
          take: limit
        })
      } else if (!findCondition && orderCondition && limit) {
        return await getMongoRepository(Entity).find({
          order: orderCondition,
          take: limit
        })
      } else if (findCondition && !orderCondition && limit) {
        return await getMongoRepository(Entity).find({
          where: findCondition,
          take: limit
        })
      } else if (findCondition && orderCondition && !limit) {
        return await getMongoRepository(Entity).find({
          where: findCondition,
          order: orderCondition
        })
      } else if (!findCondition && !orderCondition && limit) {
        return await getMongoRepository(Entity).find({
          take: limit
        })
      } else if (!findCondition && orderCondition && !limit) {
        return await getMongoRepository(Entity).find({
          order: orderCondition
        })
      } else if (findCondition && !orderCondition && !limit) {
        return await getMongoRepository(Entity).find({
          where: findCondition
        })
      } else {
        return await getMongoRepository(Entity).find()
      }
    } catch (error) {
      return new ApolloError(error, '403')
    }
  }

  async findOneAdapter(Entity: any, findCondition: any): Promise<any> {
    try {
      return await getMongoRepository(Entity).findOne(findCondition)
    } catch (error) {
      return new ApolloError(error, '403')
    }
  }

  async createAdapter(Entity: any, args: any): Promise<any> {
    if (args) {
      try {
        return await getRepository(Entity).save(new Entity(args))
      } catch (error) {
        return new ApolloError(error, '403')
      }
    } else {
      return new UserInputError(Constants.errorMessage.UserInputError)
    }
  }

  async createManyAdapter(Entity: any, documents: any): Promise<any> {
    if (documents && documents.length) {
      try {
        return await getRepository(Entity).save(
          documents.map(document => new Entity(document))
        )
      } catch (error) {
        return new ApolloError(error, '403')
      }
    } else {
      return new UserInputError(Constants.errorMessage.UserInputError)
    }
  }

  async updateOneByIdAdapter(
    Entity: any,
    documentId: string,
    update: any
  ): Promise<any> {
    if (documentId && update) {
      try {
        await getMongoRepository(Entity).updateOne({ _id: documentId }, update)
        return await getMongoRepository(Entity).findOne({ _id: documentId })
      } catch (error) {
        return new ApolloError(error, '403')
      }
    } else {
      throw new UserInputError(Constants.errorMessage.UserInputError)
    }
  }

  async updateManyAdapter(
    Entity: any,
    condition: any,
    update: any
  ): Promise<any> {
    if (condition && update) {
      try {
        await getMongoRepository(Entity).updateMany(condition, update)
        return await getMongoRepository(Entity).find(condition)
      } catch (error) {
        return new ApolloError(error, '403')
      }
    } else {
      throw new UserInputError(Constants.errorMessage.UserInputError)
    }
  }

  async deleteAdapter(
    Entity: any,
    documentId: any
  ): Promise<boolean | ApolloError | UserInputError> {
    if (documentId) {
      try {
        await getMongoRepository(Entity).updateOne(
          { _id: documentId },
          { $set: { isActive: false } }
        )
        return true
      } catch (error) {
        return new ApolloError(error, '403')
      }
    } else {
      throw new UserInputError(Constants.errorMessage.UserInputError)
    }
  }

  async removeAdapter(
    Entity: any,
    documentIds: any
  ): Promise<boolean | ApolloError | UserInputError> {
    if (documentIds && documentIds.length) {
      try {
        await getMongoRepository(Entity).deleteMany({
          _id: { $in: documentIds }
        })
        return true
      } catch (error) {
        return new ApolloError(error, '403')
      }
    } else {
      throw new UserInputError(Constants.errorMessage.UserInputError)
    }
  }

  async generateCodeAdapter(
    Entity: any,
    documentId: any,
    codeRegex: any,
    indexKey: any
  ): Promise<any> {
    if (documentId && codeRegex && indexKey) {
      try {
        let code
        const entity = await getMongoRepository(Entity).findOne({
          _id: documentId
        })
        if (!entity) {
          return 'not found entity'
        }
        if (!entity[indexKey]) {
          code = `${codeRegex}000001`
        } else {
          code = `${codeRegex}${('000000' + (entity[indexKey] + 1)).substr(-6)}`
        }
        await getMongoRepository(Entity).updateOne(
          { _id: documentId },
          {
            $set: {
              [indexKey]: entity[indexKey] + 1
            }
          }
        )
        return { code }
      } catch (error) {
        return new ApolloError(error, '403')
      }
    } else {
      throw new UserInputError(Constants.errorMessage.UserInputError)
    }
  }

  validateVietnameseName(fullName: string): boolean {
    const firstLetter = '[A-EGHIK-VXYÂĐỔÔÚỨ]'.normalize('NFC')
    const otherLetters = '[a-eghik-vxyàáâãèéêìíòóôõùúýỳỹỷỵựửữừứưụủũợởỡờớơộổỗồốọỏịỉĩệểễềếẹẻẽặẳẵằắăậẩẫầấạảđ₫]'.normalize(
      'NFC'
    )
    const regexString = `^${firstLetter}${otherLetters}\\s(${firstLetter}${otherLetters}\\s*)${firstLetter}${otherLetters}+$`
    const regexPattern = RegExp(regexString)
    return regexPattern.test(fullName.normalize('NFC'))
  }
}
