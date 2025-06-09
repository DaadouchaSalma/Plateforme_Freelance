import { gql } from '@apollo/client';

export const GET_OFFER_BY_ID = gql`
  query getOfferById($id: Int!) {
    getOfferById(id: $id) {
      id
      title
      description
      budget
      startDate
      endDate
      status
      categorie {
        id
        title
      }
    }
  }
`;
