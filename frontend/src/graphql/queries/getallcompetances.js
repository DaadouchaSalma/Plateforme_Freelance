import { gql } from '@apollo/client';
export const GET_COMPETENCES = gql`
query GetCompetences {
  getCompetences {
    id
    nom
  }
}
  `;
