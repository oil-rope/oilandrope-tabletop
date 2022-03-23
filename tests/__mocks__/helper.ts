import { faker } from '@faker-js/faker';

import { ISimpleUser } from '@Interfaces';

export const SimpleUserMock: ISimpleUser = {
  id: faker.datatype.number(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  first_name: null,
  last_name: null,
};
