import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { ThemeContext } from "../../App";
import Favorites from "../../components/favorites";
import RecipeItem from "../../components/recipe-item";
import Search from "../../components/search";
import "./styles.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "filterfavorites":
      console.log(action);
      return {
        ...state,
        filteredKey: action.value,
      };

    default:
      return state;
  }
};

const initialState = {
  filteredKey: "",
};

const Homepage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [apiCalledSuccess, setApiCallSuccess] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const getFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(getFavorites);
  }, []);

  const handleSubmit = (e, getSearchValue) => {
    e.preventDefault();
    setLoading(true);

    async function getRecipes() {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=0b486e71c68f4b9c9a0e5430c2d4b447&query=${getSearchValue}`
      );
      const data = await res.json();
      if (data && data.results) {
        setLoading(false);
        setData(data.results);
        setApiCallSuccess(true);
      }
    }

    getRecipes();
  };

  console.log(favorites);

  const addToFavorites = useCallback(
    (getCurrentItem) => {
      const cpyFavorites = [...favorites];
      const index = cpyFavorites.findIndex(
        (item) => item.id === getCurrentItem.id
      );

      if (index === -1) {
        cpyFavorites.push(getCurrentItem);

        localStorage.setItem("favorites", JSON.stringify(cpyFavorites));
        setFavorites(cpyFavorites);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("item already added to favorites");
      }
    },
    [favorites]
  );

  const removeFromFavorites = (getId) => {
    console.log(getId);

    let getFavorites = [...favorites];
    getFavorites = getFavorites.filter((item) => item.id !== getId);

    setFavorites(getFavorites);
    localStorage.setItem("favorites", JSON.stringify(getFavorites));
  };

  // const renderData = useCallback(() => {
  //   if (data && data.length > 0) {
  //     return data.map((item) => (
  //       <RecipeItem
  //         id={item.id}
  //         addToFavorites={() => addToFavorites(item)}
  //         image={item.image}
  //         title={item.title}
  //       />
  //     ));
  //   }
  // }, [data]);



  const filteredFavorites = favorites.filter((item) =>
  item.title.toLowerCase().includes(state.filteredKey)
);

  return (
    <div>
      <Search
        setApiCallSuccess={setApiCallSuccess}
        apiCalledSuccess={apiCalledSuccess}
        handleSubmit={handleSubmit}
      />
      <div className="favorites-wrapper">
        <h1
          className="favorites-title"
          style={theme ? { color: "#12343b" } : {}}
        >
          Favorites
        </h1>
        <div className="search-favorites">
          <input
            name="filterfavorites"
            placeholder="Filter favorites"
            value={state.filteredFavorites}
            onChange={(e) =>
              dispatch({ type: "filterfavorites", value: e.target.value })
            }
          />
        </div>
        <div className="favorites">
          {filteredFavorites && filteredFavorites.length > 0
            ? filteredFavorites.map((item) => (
                <Favorites
                  removeFromFavorites={() => removeFromFavorites(item.id)}
                  image={item.image}
                  id={item.id}
                  title={item.title}
                />
              ))
            : null}
        </div>
        {
           !filteredFavorites.length && <div className="loading">No Favorites added</div>
        }
      </div>

      {loading && <div className="loading">Loading ! Please wait</div>}
      <div className="items">
        {useMemo(
          () =>
            !loading &&
            data.map((item) => (
              <RecipeItem
                id={item.id}
                addToFavorites={() => addToFavorites(item)}
                image={item.image}
                title={item.title}
              />
            )),
          [addToFavorites, data, loading]
        )}
      </div>
      {!loading && !data.length && (
        <div className="loading">No items found</div>
      )}
    </div>
  );
};

export default Homepage;
