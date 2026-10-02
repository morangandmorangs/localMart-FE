import { ArrowRightIcon, SearchIcon } from "./Icons";

/** Plain GET form — submits to /search?q=… with no JS required. */
export function SearchBar() {
  return (
    <form className='lm-search' action='/search' method='get' role='search'>
      <SearchIcon className='lm-search__icon' />
      <div className='lm-search__field'>
        <label className='lm-search__label' htmlFor='lm-search-input'>
          Search any items
        </label>
        <input
          id='lm-search-input'
          className='lm-search__input'
          type='search'
          name='q'
          autoComplete='off'
          placeholder='Vegetables, rice, fish, meals,'
        />
      </div>
      <button className='lm-search__submit' type='submit' aria-label='Search'>
        <ArrowRightIcon />
      </button>
    </form>
  );
}
