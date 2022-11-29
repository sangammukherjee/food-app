import { useCallback, useContext } from "react";
import { ThemeContext } from "../../App";
import './styles.css'

const Favorites = (props) => {
  const { id, image, title , removeFromFavorites } = props;
  const {theme} = useContext(ThemeContext)


  return (
    <div className="favorite-item" key={id}>
      <div>
        <img src={image} alt="alt" />
      </div>
      <p style={theme ? {color : '#12343b'} : {}}>{title}</p>
      <button style={theme ? {backgroundColor : '#12343b'} : {}} onClick={removeFromFavorites}>Remove from favorites</button>
    </div>
  );
};

export default Favorites;
