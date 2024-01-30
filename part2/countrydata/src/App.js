import { useState,useEffect } from "react";
import axios from "axios";
import {v4 as uuid} from "uuid";

const SingleCountry = ({country})=>{
    //console.log(country);
    return (
        <>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital[0]} <br /> Area: {country.area}</p>
        <h2>languages:</h2>
        <ul>
            {Object.values(country.languages).map(language => <li key={uuid()}>{language}</li>)}
        </ul>
        <div className="flag">
            <img src={country.flags.svg} alt={country.flags.alt} />
        </div>
        </>
    )
}

const App = ()=>{
    const [searchTerm,setSearchTerm] = useState('');
    const [allCountries,setAllCountries] = useState(null);
    const [searchList,setSearchList] = useState(null);

    const handleCountrySearch = (e)=>{
        const temp = [];
        const text = e.target.value;
        setSearchTerm(text);

        if (text === "") {
            setSearchList(null);
          } else {
            allCountries.forEach((country) => {
              if (country.name.common.toLowerCase().search(text) !== -1) {
                temp.push(country);
              }
            });
            setSearchList(temp);
          }
    }

    useEffect(()=>{
        axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then((response)=>{
            setAllCountries(response.data); //
        })
        .catch((error)=>{
            console.log(error.message);
        });
    },[])

    return (
    <>
    <div>
        Filter countries <input type="text" value={searchTerm} onChange={(e)=> handleCountrySearch(e)}/>
    </div>
    <div>
        {(allCountries && searchList) && 
        
        (searchList.length > 10 ?
            <>Too many results, narrow search</>
            :
            (searchList.length === 1 ? 
                <SingleCountry country={searchList[0]} /> : searchList.map(country=><p id={uuid()}>{country.name.common}</p>)
            )
        )}
    </div>
    </>
    )
}

export default App;