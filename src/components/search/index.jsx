import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../App";
import "./styles.css";

const Search = (props) => {
  const { handleSubmit, apiCalledSuccess, setApiCallSuccess } = props;
  const [search, setSearch] = useState("");
  const { theme } = useContext(ThemeContext);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const onSubmit = (e) => {
    handleSubmit(e, search);
  };

  useEffect(() => {
    if (apiCalledSuccess) {
      setSearch("");
      setApiCallSuccess(false);
    }
  }, [apiCalledSuccess]);

  return (
    <form className="form" onSubmit={onSubmit}>
      <input
        name="search"
        id="search"
        value={search}
        onChange={handleChange}
        placeholder="Search Recipes"
      />
      <button
        style={theme ? { backgroundColor: "#12343b" } : {}}
        disabled={search.trim() === ""}
        type="submit"
      >
        Search recipes
      </button>
    </form>
  );
};

export default Search;
