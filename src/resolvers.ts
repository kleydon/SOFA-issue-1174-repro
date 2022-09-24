import 'reflect-metadata'
import { GraphQLResolveInfo } from 'graphql'
import { Context } from './context'
import { 
  NonEmptyArray,
  ObjectType,
  Field,
  Resolver,
  Mutation,
  Query,
  Info,
  Ctx,
  Arg,
} from 'type-graphql'
import { User } from '@generated/type-graphql'

// String / Boolean Payload types

@ObjectType()
export class StringPayload {
  @Field(() => String)
  value!: String;
  constructor (value: String) {
    this.value = value;
  }
}

@ObjectType()
export class BooleanPayload {
  @Field(() => Boolean)
  value!: boolean;
  constructor (value: boolean) {
    this.value = value;
  }
}

// Auth resolvers

@Resolver(of => User) //We need to hang these resolvers off of a model; arbitrariliy choosing User.
export class AuthResolver {

  @Query(returns => BooleanPayload)
  async loggedIn(
    @Ctx() ctx: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<BooleanPayload> {
    console.log('authLoggedIn()')
    return { value: true }
  }

  @Mutation(returns => StringPayload)
  async loginByPhone(
    @Ctx() ctx: Context,
    @Info() info: GraphQLResolveInfo,
    @Arg('phone') phone: string,  // phone: E164 format phone number
  ): Promise<StringPayload> {
    console.log('authLoginByPhone()')
    return { value: 'Request successfully handled.' }
  } 
}

export const resolvers: NonEmptyArray<Function> = [
  AuthResolver,
]