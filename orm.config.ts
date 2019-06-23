import { User } from 'src/user/user.entity';

const ormconfig = {
  type: 'mongodb',
  url: 'mongodb://chnirt:chin04071803@ds055690.mlab.com:55690/nest-graphql',
  // entities: [User], //<----include all
  synchronize: true,
  useNewUrlParser: true,
  logging: true,
};

export default ormconfig;
