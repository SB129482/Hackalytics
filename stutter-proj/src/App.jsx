import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { render, screen } from '@testing-library/react';
import MicButton from "./components/MicButton.jsx";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([{
    message: "Hellaur",
    sender: "shreya"
  }])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }
    const newMessages = [...messages, newMessage]; // all the old messages + the new message

    // update the messages state
    setMessages(newMessages);
    // set typing activity
    setTyping(true);

    // process message to chatgpt/cloudflare (send it over and see the response)
  }

  // test('renders with lame', () => {
  //   render(<MicButton />);
  //   const linkElement = screen.getByText(/lame/i);
  //   expect(linkElement).toBeInTheDocument();
  // })



  return (
    <div>
      {/* <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={typing ? <TypingIndicator content="Stutstut is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList> */}

      <MicButton />
      {/* <MessageInput placeholder='Type message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div> */}
    </div>
  )
}

export default App
