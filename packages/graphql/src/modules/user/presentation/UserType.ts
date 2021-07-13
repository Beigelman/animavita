import {
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLString,
} from 'graphql';
import {globalIdField} from 'graphql-relay';

import {registerType, NodeInterface} from '../../../interfaces/NodeInterface';
import {GraphQLContext} from '../../../types';
import {Email, Id, ProfileImage} from '../domain/User';

import User from './routes/queries/UserLoader';

const providedByField: GraphQLFieldConfigMap<any, GraphQLContext, any> = {
  providedBy: {
    type: GraphQLNonNull(GraphQLString),
    resolve: obj => obj.providedBy,
  },
};

const ProviderIdType = new GraphQLObjectType<Id>({
  name: 'ProviderId',
  description: 'The id of the user in the provider DB',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLString),
      resolve: obj => obj.id,
    },
    ...providedByField,
  }),
});

const EmailType = new GraphQLObjectType<Email>({
  name: 'Email',
  fields: () => ({
    email: {
      type: GraphQLNonNull(GraphQLID),
      resolve: obj => obj.email,
    },
    ...providedByField,
  }),
});

const ProfileImageType = new GraphQLObjectType<ProfileImage>({
  name: 'ProfileImage',
  fields: () => ({
    url: {
      type: GraphQLNonNull(GraphQLString),
      description: 'The url of the profile image',
      resolve: obj => obj.url,
    },
    ...providedByField,
  }),
});

type ConfigType = GraphQLObjectTypeConfig<User, GraphQLContext>;

const UserTypeConfig: ConfigType = {
  name: 'User',
  description: 'Animavita user',
  fields: () => ({
    id: globalIdField('User', user => user._id),
    _id: {
      type: GraphQLNonNull(GraphQLID),
      description: 'MongoDB _id',
      resolve: user => user._id.toString(),
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
      description: 'The name of the user',
      resolve: user => user.name,
    },
    emails: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(EmailType))),
      description: 'Emails of the user separed by provider',
      resolve: user => user.emails,
    },
    providerIds: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ProviderIdType))),
      resolve: user => user.providerIds,
    },
    // TODO: add field to return the latest profile image
    profileImages: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ProfileImageType))),
      resolve: user => user.profileImages,
    },
  }),
  interfaces: () => [NodeInterface],
};

const UserType = new GraphQLObjectType(UserTypeConfig);

export default registerType(UserType);
