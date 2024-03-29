import "./App.css";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_STAR, REMOVE_STAR, SEARCH_REPOSITORIES } from "./graphql";
import { useState } from "react";

interface Repository {
  id: string;
  name: string;
  url: string;
  stargazers: { totalCount: number };
  viewerHasStarred: boolean;
}

interface PageInfo {
  __typename: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
}
interface SearchResults {
  repositoryCount: number;
  edges: { node: Repository }[];
  pageInfo: PageInfo;
}

interface QueryData {
  search: SearchResults;
}

type QueryVariables = {
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
  query: string;
};

const PER_PAGE = 5;

const INITIAL_VARIABLES = {
  after: null,
  before: null,
  first: PER_PAGE,
  last: null,
  query: "フロントエンドエンジニア",
};

function App() {
  const [variables, setVariables] = useState<QueryVariables>(INITIAL_VARIABLES);
  const { loading, error, data } = useQuery<QueryData, QueryVariables>(
    SEARCH_REPOSITORIES,
    {
      variables: variables,
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVariables({
      ...variables,
      query: event.target.value,
    });
  };
  console.log("data?.search", data?.search);
  const search = data?.search;
  const repositoryCount = search?.repositoryCount;
  const repositoryUnit = repositoryCount === 1 ? "Repository" : "Repositories";
  const title = `GitHub Repositories Search Results - ${repositoryCount} ${repositoryUnit}`;

  const handleGoPrevious = (search: SearchResults) => {
    setVariables({
      ...variables,
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor,
    });
  };

  const handleGoNext = (search: SearchResults) => {
    setVariables({
      ...variables,
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null,
    });
  };

  console.log(data?.search.edges);

  return (
    <>
      <form>
        <input
          type="text"
          value={variables.query}
          onChange={handleChangeQuery}
        />
      </form>

      <h2>{title}</h2>
      <ul>
        {search?.edges.map((edge) => {
          return (
            <li key={edge.node.id}>
              <a href={edge.node.url} target="_blank" rel="noopener noreferrer">
                {edge.node.name}
              </a>
              &nbsp;
              <StarButton node={edge.node} variables={variables} />
            </li>
          );
        })}
      </ul>
      {search?.pageInfo.hasPreviousPage ? (
        <button onClick={() => handleGoPrevious(search)}>Previous</button>
      ) : (
        <></>
      )}
      {search?.pageInfo.hasNextPage ? (
        <button onClick={() => handleGoNext(search)}>Next</button>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;

interface StarButtonProps {
  node: Repository;
  variables: QueryVariables;
}

interface Stargazers {
  totalCount: number;
}

interface Starrable {
  id: string;
  viewerHasStarred: boolean;
  stargazers: Stargazers;
}

interface MutationData {
  starrable: Starrable;
}

interface AddRemoveStarMutationVariables {
  input: {
    starrableId: string;
  };
}

function StarButton({ node, variables }: StarButtonProps) {
  const totalCount = node.stargazers.totalCount;
  const viewrHasStared = node.viewerHasStarred;
  const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`;
  const [addStar, { loading: addStarLoading }] = useMutation<
    MutationData,
    AddRemoveStarMutationVariables
  >(ADD_STAR, {
    variables: {
      input: {
        starrableId: node.id,
      },
    },
    refetchQueries: [{ query: SEARCH_REPOSITORIES, variables: variables }],
  });

  const [removeStar, { loading: removeStarLoading }] = useMutation<
    MutationData,
    AddRemoveStarMutationVariables
  >(REMOVE_STAR, {
    variables: {
      input: {
        starrableId: node.id,
      },
    },
    refetchQueries: [{ query: SEARCH_REPOSITORIES, variables: variables }],
  });
  const handleAddStar = () => {
    addStar();
  };

  const handleRemoveStar = () => {
    removeStar();
  };
  return (
    <button
      onClick={viewrHasStared ? handleRemoveStar : handleAddStar}
      disabled={addStarLoading || removeStarLoading}
    >
      {starCount} | {viewrHasStared ? "starred" : "-"}
    </button>
  );
}
