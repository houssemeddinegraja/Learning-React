import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function Button() {
  return <button className="button">I'm a button</button>
}

function Button2(props) {
  const styles = {
    backgroundColor: props.bgColor,
    color: props.color,
    fontSize: props.fontSize + 'px'
  };

  return <button style={styles}>I'm another button with props</button>
}

function Button3( { text, bgColor, color, fontSize } ) {
  const styles = {
    backgroundColor: bgColor,
    color: color,
    fontSize: fontSize + 'px'
  };

  return <button style={styles}>{text}</button>
}

function Button4({ text="I'm a button with default props", bgColor="pink", color="black", fontSize=27 }) {
  const styles = {
    backgroundColor: bgColor,
    color: color,
    fontSize: fontSize + 'px'
  };

  return <button style={styles}>{text}</button>
}

function ButtonFunc( { text, bgColor, color, fontSize, handleClick } ) {
  const styles = {
    backgroundColor: bgColor,
    color: color,
    fontSize: fontSize + 'px'
  };

  return <button style={styles} onClick={handleClick}>{text}</button>
}

function ListItem(props) {
  return <li>{props.animal}</li>
}

function List(props) {
  return (
    <ul>
      {props.animals.map((animal) => {
        return <ListItem key={animal} animal={animal} />;
      })}
    </ul>
  );
}

function List2(props) {
  return (
    <ul>
      {props.animals.map((animal) => {
        return animal.startsWith("L") && <li key={animal}>{animal}</li>;
      })}
    </ul>
  );
}

function Person() {
  const [person, setPerson] = useState({ name: "John", age: 100 });

  // BAD - Don't do this!
  const handleIncreaseAge1 = () => {
    // mutating the current state object
    person.age = person.age + 1;
    setPerson(person);
  };

  // GOOD - Do this!
  const handleIncreaseAge2 = () => {
    // copy the existing person object into a new object
    // while updating the age property
    const newPerson = { ...person, age: person.age + 1 };
    setPerson(newPerson);
  };

  return (
    <>
      <h1>{person.name}</h1>
      <h2>{person.age}</h2>
      <button onClick={handleIncreaseAge2}>Increase age</button>
    </>
  );
}

function App() {
  const [count, setCount] = useState(0)

  const handleClickButton = () => {
    setCount(count + 1);
  };

  const superstars = ['Randy Orton', 'John Cena', 'Steve Austin', 'Shawn Michaels', 'Brock Lesnar', 'Seth Rollins', 'Edge'];
  const animals = ["Lion", "Cow", "Snake", "Lizard"];

  // a list of todos, each todo object has a task and an id
  const todos = [
    { task: "mow the yard", id: crypto.randomUUID() },
    { task: "Work on Odin Projects", id: crypto.randomUUID() },
    { task: "feed the cat", id: crypto.randomUUID() },
  ];
  return (
    <>
      <h1>Hello there, React !</h1>
      <h2>I'm just starting out with React!</h2>
      <Button />
      <Button2 bgColor="yellow" color="black" fontSize={16} />
      <Button2 bgColor="blue" color="white" fontSize={20} />
      <Button2 bgColor="green" color="white" fontSize={30} />
      <Button3 text="I'm a button with destructured props" bgColor="red" color="white" fontSize={24} />
      <Button4 />
      <Button4 text="I'm a button with custom props" bgColor="purple" color="white" fontSize={18} />
      <Button4 bgColor="orange" fontSize={22} />
      <ButtonFunc text="I'm a button with a click handler" bgColor="lightblue" color="darkblue" fontSize={20} handleClick={handleClickButton} />
      {count > 0 && <h2>BUTTON WITH CLICK HANDLER CLICKED {count} TIMES!</h2>}
    
      <h2>Rendering a list of superstars with JSX:</h2>
      <ul>
        {superstars.map((superstar) => (
          <li key={superstar}>{superstar}</li>
        ))}
      </ul>

      <h1>Rendering a list of components of animals with JSX:</h1>
      <List animals={animals} />

      <h1>CONDITIONAL rendering of animals starting with "L": </h1>
      <List2 animals={animals} />

      <h3>Todo List:</h3>
      <ul>
      {todos.map((todo) => (
        // here we are using the already generated id as the key.
        <li key={todo.id}>{todo.task}</li>
      ))}
    </ul>

    <Person />
    </> 
  )
}

export default App
