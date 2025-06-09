import { gql } from "@apollo/client";

export const UPDATE_OFFRE = gql`
  mutation UpdateOffer(
  $id: Int!
    $title: String
    $description: String
    $budget: Int
    $startDate: DateTime
    $endDate: DateTime
    $status: String
    $categorieId: Int
  ) {
    updateOffer(
      id: $id
      title: $title
      description: $description
      budget: $budget
      startDate: $startDate
      endDate: $endDate
      status: $status
      categorieId: $categorieId
    ) {
      id
      title
    }
  }
`;

