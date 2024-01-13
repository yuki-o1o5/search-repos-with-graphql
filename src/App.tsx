import "./App.css";
import { useQuery } from "@apollo/client";
import { SEARCH_REPOSITORIES } from "./graphql";
import { useState } from "react";

const INITIAL_VARIABLES = {
  after: null,
  before: null,
  first: 5,
  last: null,
  query: "フロントエンドエンジニア",
};

type QueryVariables = {
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
  query: string;
};

function App() {
  const [valiables, setValiables] = useState<QueryVariables>(INITIAL_VARIABLES);
  const { loading, error, data } = useQuery(SEARCH_REPOSITORIES, {
    variables: valiables,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValiables({
      ...valiables,
      query: event.target.value,
    });
  };
  console.log("query:", valiables.query);
  return (
    <>
      <div>Hello</div>
      <form>
        <input
          type="text"
          value={valiables.query}
          onChange={handleChangeQuery}
        />
      </form>
      {console.log(data)}
    </>
  );
}

export default App;
