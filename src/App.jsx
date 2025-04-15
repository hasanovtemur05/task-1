import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

const App = () => {
  const [people, setPeople] = useState([]);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [person1, setPerson1] = useState(null);
  const [person2, setPerson2] = useState(null);
  const [commonRelations, setCommonRelations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/people")
      .then((res) => res.json())
      .then((data) => setPeople(data))
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = () => {
    setErrorMessage("");
    const match1 = people.find((item) =>
      `${item.firstName}`
        .toLowerCase()
        === (name1.toLowerCase())
    );
    const match2 = people.find((item) =>
      `${item.firstName}`
        .toLowerCase()
        === (name2.toLowerCase())
    );

    if (!match1) {
      setErrorMessage((prev) => prev + " Ism 1 bo'yicha inson topilmadi. "); 
    }
    if (!match2) {
      setErrorMessage((prev) => prev + " Ism 2 bo'yicha inson topilmadi. "); 
    }

    setPerson1(match1 || null);
    setPerson2(match2 || null);

    if (match1 && match2) {
      const relations1 = match1.relations || [];
      const relations2 = match2.relations || [];

      const commonIds = relations1
        .map((item) => {
          const match = relations2.find((el) => el.personId === item.personId);
          if (match) {
            return {
              personId: item.personId,
              type1: item.type,
              type2: match.type,
            };
          }
          return null;
        })
        .filter(Boolean);

      const relatedPeople = commonIds.map((rel) => {
        const person = people.find((p) => p.id === rel.personId);
        return {
          ...person,
          relationToPerson1: rel.type1,
          relationToPerson2: rel.type2,
        };
      });

      setCommonRelations(relatedPeople);
    } else {
      setCommonRelations([]);
    }
  };

  const renderPerson = (person) => {
    return (
      <div className="border-[1px] border-[#CBD5E1] p-[30px] shadow-lg rounded-xl">
        <h2 className="text-lg font-bold">
          {person.firstName} {person.lastName}
        </h2>
        <p>
          <strong>Manzil:</strong> {person.address}
        </p>
        <p>
          <strong>Tug‘ilgan joy:</strong> {person.birthPlace}
        </p>
        <p>
          <strong>Tug‘ilgan sana:</strong> {person.birthDate}
        </p>
      </div>
    );
  };

  return (
    <div className="w-[90%] m-auto">
      <div className="flex flex-col gap-[25px] border-[1px] border-[#CBD5E1] p-[30px] shadow-lg rounded-xl">
        <div className="grid gap-[10px] sm:grid-cols-2 sm:gap-[50px] md:gap-[80px] lg:gap-[120px] xl:gap-[200px]">
          <div>
            <h1>Name 1</h1>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              className="border-2 w-full rounded-lg py-1 lg:py-[8px] px-4 border-[#CBD5E1]"
              placeholder="Isim kiriting"
            />
          </div>
          <div>
            <h1>Name 2</h1>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              className="border-2 w-full rounded-lg py-1 lg:py-[8px] px-4 border-[#CBD5E1]"
              placeholder="Isim kiriting"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="bg-[#1a478f] text-white rounded-lg py-[10px] lg:py-[14px] lg:text-[20px]"
        >
          <CiSearch className="inline-block" /> Qidirish
        </button>

        {errorMessage && (
          <div className="mt-4 text-red-500 font-semibold">
            <p>{errorMessage}</p>
          </div>
        )}
</div> 
       
        <div className="grid gap-4 lg:gap-6 xl:gap-9 mt-6 sm:grid-cols-2">
          {person1 && renderPerson(person1)}
          {person2 && renderPerson(person2)}
        </div>
        

        <div className="mt-8 ">
          <h1 className="text-xl font-semibold mb-2">
            Ular bilan bog‘liq umumiy odamlar:
          </h1>
          {commonRelations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
              {commonRelations.map((item) => (
                <div
                  key={item.id}
                  className="border-[1px] border-[#CBD5E1] p-[30px] shadow-lg rounded-xl "
                >
                  <h4 className="font-bold">
                    {item.firstName} {item.lastName}
                  </h4>
                  <p>{item.address}</p>
                  <p className="text-sm text-gray-700">
                    {person1?.firstName} bilan:{" "}
                    <strong>{item.relationToPerson1}</strong>
                    <br />
                    {person2?.firstName} bilan:{" "}
                    <strong>{item.relationToPerson2}</strong>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xl">Ular orasida umumiy tanish topilmadi.</p>
          )}
        </div>
      </div>
    
  );
};

export default App;
