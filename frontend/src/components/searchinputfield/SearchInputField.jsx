import React, {useState} from 'react';
import AxiosApi from "../../api/axiosApi";
import {useDebouncedCallback} from "use-debounce";

const SearchInputField = ({formClass}) => {
    const api = new AxiosApi();
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);


    const debounced = useDebouncedCallback(async () => {

        try {
            const response = await api.get('/geoapi/search?text=' + inputValue);
            const data = await response.results;
            setSuggestions(data)
        } catch (e) {
            console.error(e);
            setSuggestions(['No locations founded!'])
        }

    }, 500)

    const handelChange = (e) => {
        setInputValue(e.target.value);

        if (inputValue.trim() && inputValue.length >= 3) {
            debounced()
        } else {
            setSuggestions([])
        }
    }
    return (
        <>
            <div className="relative">
                <form className={formClass}>
                    <label htmlFor="topbar-search" className="sr-only">Search</label>
                    <div className="relative mt-1 lg:w-96">
                        <div
                            className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input onChange={handelChange}
                               type="text" name="email" id="topbar-search"
                               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-9 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="Search"
                               value={inputValue}
                        />
                    </div>
                </form>
                {suggestions.length !== 0 && (
                    <div className="absolute suggestions-list w-full shadow-lg rounded-lg">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 w-full">
                            {suggestions.length !== 0 && suggestions.map(suggestion => (
                                <li key={suggestion.place_id}>
                                    <button onClick={() => {
                                        setInputValue(suggestion.formatted)
                                        setSuggestions([])
                                    }} type={'button'}
                                            className={'text-start w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white bg-white dark:bg-gray-800'}>
                                        {suggestion.formatted}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchInputField;