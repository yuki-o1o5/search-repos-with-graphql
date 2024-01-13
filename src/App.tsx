import "./App.css";

const GITHUB_TOKEN = import.meta.env.VITE_REACT_APP_GITHUB_TOKEN;

function App() {
  console.log({ GITHUB_TOKEN });
  return (
    <>
      <div>Hello</div>
    </>
  );
}

export default App;
