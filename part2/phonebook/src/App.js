import { useEffect, useState } from "react";
import { getAll, addPerson, updPerson, deletePerson } from "./personService";

const Person = ({ person, persons, setPersons, setNotificationMessage }) => {
  const handlePersonDelete = () => {
    if (window.confirm(`Delete ${person.name} from records?`)) {
      deletePerson(person.id)
        .then((response) => {
          setPersons(persons.filter((person) => person.id !== response.id));
          setNotificationMessage(`Deleted ${person.name} : ${person.number}`);
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      return;
    }
  };

  return (
    <li>
      {person.name} {person.number}{" "}
      <button onClick={() => handlePersonDelete()}>delete</button>
    </li>
  );
};

const PersonForm = ({ persons, setPersons, setNotificationMessage }) => {
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (newName === "") {
      alert("Name cannot be empty");
      return;
    }
    if (newNum === "") {
      alert("Number cannot be empty");
      return;
    }

    let flag = 0;
    let updID = null;
    persons.forEach((persons) => {
      if (persons.name === newName && persons.number !== newNum) {
        flag = 1;
        updID = persons.id;
        return;
      } else if (persons.name === newName && persons.number === newNum) {
        flag = 2;
        return;
      }
    });

    const newPerson = {
      name: newName,
      number: newNum,
    };

    if (flag === 1) {
      if (
        window.confirm(
          `${newName} already exists in the phonebook, replace the old number with the new number?`
        )
      ) {
        updPerson(updID, newPerson)
          .then((response) => {
            setPersons(
              persons.map((persons) =>
                persons.id === updID ? { ...newPerson, id: updID } : persons
              )
            );
            setNewName("");
            setNewNum("");
            setNotificationMessage(
              `Updated phone number to ${newNum} for ${newName}`
            );
          })
          .catch((err) => setNotificationMessage(`${newName} has been removed from the server`));
      }
      return;
    }
    if (flag === 2) {
      alert(
        `${newName} already exists in the phonebook with the same number, please try again`
      );
      setNewName("");
      setNewNum("");
      return;
    }

    addPerson(newPerson)
      .then((response) => {
        setPersons(persons.concat({ ...response }));
        setNewName("");
        setNewNum("");
        setNotificationMessage(`Added ${newName} : ${newNum}`);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleNameInput = (e) => {
    setNewName(e.target.value);
  };

  const handleNumInput = (e) => {
    setNewNum(e.target.value);
  };

  return (
    <form onSubmit={(e) => handleFormSubmit(e)}>
      <div>
        name: <input value={newName} onChange={(e) => handleNameInput(e)} />
      </div>
      <div>
        number: <input value={newNum} onChange={(e) => handleNumInput(e)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Filter = ({ persons, setSearchList }) => {
  const handleSearchInput = (e) => {
    const personsCopy = [...persons];
    const temp = [];
    const text = e.target.value.trim().toLowerCase();

    if (text === "") {
      setSearchList(null);
    } else {
      personsCopy.forEach((person) => {
        if (person.name.toLowerCase().search(text) !== -1) {
          temp.push(person);
        }
      });
      setSearchList(temp);
    }
  };
  return (
    <div>
      filter shown with <input onChange={(e) => handleSearchInput(e)} />
    </div>
  );
};

const Notification = ({ notificationMessage, setNotificationMessage }) => {
  useEffect(() => {
    if (notificationMessage)
      setTimeout(() => {
        setNotificationMessage(null);
      }, 3000);
  }, [notificationMessage, setNotificationMessage]);

  return (
    notificationMessage && <div className="error">{notificationMessage}</div>
  );
};

const App = () => {
  // const{
  //   "persons":[
  //     {
  //       "name": "Arto Hellas",
  //       "number": "040-123456",
  //       "id": 1
  //     },
  //     {
  //       "name": "Ada Lovelace",
  //       "number": "39-44-5323523",
  //       "id": 2
  //     },
  //     {
  //       "name": "Dan Abramov",
  //       "number": "12-43-234345",
  //       "id": 3
  //     },
  //     {
  //       "name": "Mary Poppendieck",
  //       "number": "39-23-6423122",
  //       "id": 4
  //     }
  //   ]
  // }
  const [persons, setPersons] = useState([]);
  const [searchList, setSearchList] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    getAll()
      .then((persons) => setPersons(persons))
      .catch((error) => alert(error.message));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        notificationMessage={notificationMessage}
        setNotificationMessage={setNotificationMessage}
      />
      <Filter persons={persons} setSearchList={setSearchList} />
      <h2>add new number</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        setNotificationMessage={setNotificationMessage}
      />
      <h2>Numbers</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {searchList
          ? searchList.map((person, i) => (
              <Person
                key={person.id}
                person={person}
                persons={persons}
                setPersons={setPersons}
                setNotificationMessage={setNotificationMessage}
              />
            ))
          : persons.map((person, i) => (
              <Person
                key={person.id}
                person={person}
                persons={persons}
                setPersons={setPersons}
                setNotificationMessage={setNotificationMessage}
              />
            ))}
      </ul>
    </div>
  );
};

export default App;
