import { gql } from "apollo-boost";
import "./App.css";
import { useQuery } from "@apollo/client";

const ME = gql`
  query me {
    user(login: "yuki-o1o5") {
      name
      avatarUrl
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(ME);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  return (
    <>
      <div>Hello</div>
      {data.user.name}
    </>
  );
}

export default App;
