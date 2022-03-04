import { faker } from '@faker-js/faker';

import { ISimpleUser } from '@/interfaces';

export const SimpleUserMock: ISimpleUser = {
  id: faker.datatype.number(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
};
