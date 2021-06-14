import jwt from 'jsonwebtoken';

import UsersRepository from '../../../domain/UsersRepository';
import {JWT_KEY} from '../../../../../common/config';
import TokenProvider from '../model/TokenProvider';

export default function jwtTokenProvider(userRepository: UsersRepository): TokenProvider {
  return {
    generateToken(userId: string) {
      return `JWT ${jwt.sign({id: userId}, JWT_KEY)}`;
    },

    async getUser(token: string) {
      if (!token) return null;

      try {
        const decodedToken = jwt.verify(token.substring(4), JWT_KEY);

        const user = await userRepository.findById((decodedToken as {id: string}).id);

        if (!user) return null;

        return user;
      } catch (err) {
        return null;
      }
    },
  };
}
