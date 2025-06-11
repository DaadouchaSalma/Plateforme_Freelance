import { gql } from '@apollo/client';
export const GET_COMPETENCES = gql`
query GetCompetences {
  getCompetences {
    id
    nom
  }
}
  `;


export const GET_ALL_COMPETENCES = gql`
  query GetCompetences {
    getCompetences {
      id
      nom
      FreelancerCompetences{
      id
      niveau
      }
    }
  }
`;
