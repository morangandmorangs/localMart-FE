import { SearchIcon } from "./Icons";

/** Plain GET form — submits to /search?q=… with no JS required. */
export function SearchBar() {
  return (
    <form className='lm-search' action='/search' method='get' role='search'>
      <button className='lm-search__submit' type='submit' aria-label='Search'>
        <SearchIcon />
      </button>
      <label className='lm-visually-hidden' htmlFor='lm-search-input'>
        Search any items
      </label>
      <input
        id='lm-search-input'
        className='lm-search__input'
        type='search'
        name='q'
        autoComplete='off'
        placeholder='Search for vegetables, rice, fish, meals and more…'
      />
    </form>
  );
}
