import { gql } from '@apollo/client';
export const DELETE_OFFER = gql`
  mutation DeleteOffer($offerId: Int!) {
    deleteOffer(offerId: $offerId)
  }
`;
