import { useSelector } from "react-redux";
import React from "react";

function Person() {
  const name = useSelector((state) => state[0].name);
  const surname = useSelector((state) => state[0].surname);
  const city = useSelector((state) => state[0].city);
  const country = useSelector((state) => state[0].country);
  const timezone = useSelector((state) => state[0].timezone);
  const email = useSelector((state) => state[0].email);
  const company = useSelector((state) => state[0].resume[0].company);
  const position = useSelector((state) => state[0].resume[0].position);
  return (
    <>
      <h3>
        {name} {surname}
      </h3>
      <span>
        {city}, {country}
      </span>
      <br></br>

      <span>{timezone}</span>
      <p>
        {company} / {position}
      </p>

      <div>
        <p>{email}</p>
        <p>
          Люблю работать с данными и находить в них интересные закономерности
        </p>
      </div>
      <div>
        <p> #skills</p>
      </div>
    </>
  );
}

export default Person;
