// src/pages/components/offre/ajoutOffre.js
import { gql } from '@apollo/client';

export const AJOUT_OFFRE = gql`
  mutation CreateOffer(
    $title: String!
    $description: String!
    $budget: Float!
    $startDate: String!
    $endDate: String!
    $status: String!
    $competenceIds: [Int!]!
    $categorieId: Int!
  ) {
    createOffer(
      title: $title
      description: $description
      budget: $budget
      startDate: $startDate
      endDate: $endDate
      status: $status
      competenceIds: $competenceIds
      categorieId: $categorieId
    ) {
      id
      title
    }
  }
`;
