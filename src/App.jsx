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

function App() {
  const [count, setCount] = useState(0)

  const handleClickButton = () => {
    setCount(count + 1);
  };

  const superstars = ['Randy Orton', 'John Cena', 'Steve Austin', 'Shawn Michaels', 'Brock Lesnar', 'Seth Rollins', 'Edge'];

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
    </>
  )
}

export default App
