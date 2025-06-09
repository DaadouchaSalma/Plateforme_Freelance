import { GET_ALL_CLIENTS_QUERY } from "../../graphql/mutations/client"
import React from "react";
import { useQuery } from "@apollo/client";

export const ClientTable = () => {
  const { loading, error, data } = useQuery(GET_ALL_CLIENTS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading clients: {error.message}</p>;

  const clients = data.allClients;
  clients.map((client) => {
    console.log("Client photo:", client.photo);
  })

  return (
    <div className="card border-0 shadow">
      <div className="card-header">
        <h5 className="mb-0">Clients</h5>
      </div>
      <div className="card-body p-0">
        <table className="table table-hover table-nowrap mb-0">
          <thead className="thead-light">
            <tr>
              <th scope="col">Photo</th>
              <th scope="col">Nom</th>
              <th scope="col">Email</th>
              <th scope="col">Secteur</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>
                  {client.photo ? (
                    <img src="/profile-picture-1.jpg"  alt="Client" width="40" height="40" style={{ borderRadius: "50%" }} />
                  ) : (
                    <span>No photo</span>
                  )}
                </td>
                <td>{client.nom}</td>
                <td>{client.user.email}</td>
                <td>{client.domaine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
