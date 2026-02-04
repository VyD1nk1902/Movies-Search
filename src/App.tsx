import MovieSearch from "./components/MovieSearch";
import { useTMDBConfig } from "./hooks/useTMDBConfig";

function App() {
  useTMDBConfig();
  return (
    <>
      <MovieSearch />
    </>
  );
}

export default App;
