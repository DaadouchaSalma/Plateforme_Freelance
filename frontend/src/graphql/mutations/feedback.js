import { gql } from '@apollo/client';

export const CREATE_FEEDBACK = gql`
  mutation CreateFeedback(
    $receiverId: Int!, 
    $receiverType: String!, 
    $rating: Float!, 
    $comment: String!
  ) {
    createFeedback(
      receiverId: $receiverId,
      receiverType: $receiverType,
      rating: $rating,
      comment: $comment
    ) {
      id
      rating
      comment
      createdAt
      senderfreelancer {
        id
        nom
        prenom
      }
      senderClient {
        id
        nom
      }
      receiverfreelancer {
        id
        nom
        prenom
      }
      receiverClient {
        id
        nom
      }
    }
  }
`;

export const GET_MY_FEEDBACKS = gql`
  query GetMyFeedbacks {
    getMyFeedbacks {
    id
    rating
    comment
    createdAt
    senderfreelancer {
        id
        nom
        prenom
    }
    senderClient {
        id
        nom
    }
    receiverfreelancer {
        id
        nom
        prenom
    }
    receiverClient {
        id
        nom
    }
  }
}
`;


export const GET_FEEDBACKS_BY_USER_ID = gql`
  query GetFeedbacksByUserId($userId: Int!, $userType: String!) {
    getFeedbacksByUserId(userId: $userId, userType: $userType) {
      id
      rating
      comment
      createdAt
      senderfreelancer {
        id
        nom
        prenom
      }
      senderClient {
        id
        nom
      }
      receiverfreelancer {
        id
        nom
        prenom
      }
      receiverClient {
        id
        nom
      }
    }
  }
`;
