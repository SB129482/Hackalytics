import {
  ChatContainer,
  InputToolbox,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./App.css";
import MicButton from "./components/MicButton.jsx";
import logo from "./logo.jpg";

const API_KEY = "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";
const PROMPTS = [
  "The sun was setting, casting long shadows across the park. Children's laughter echoed as they played on the swings, their faces glowing with joy. Parents watched from nearby benches, their conversations a soft hum in the background. The scent of freshly cut grass filled the air, a sure sign of spring.",
  "In the heart of the city, skyscrapers reached for the sky, their glass windows reflecting the hustle and bustle below. Cars honked, people chatted, and the aroma of street food wafted through the air. Despite the chaos, there was a rhythm to the city, a pulse that was almost tangible.",
  "The library was a sanctuary of knowledge, filled with rows upon rows of books. Each one held a different world, a different story. The silence was punctuated only by the soft rustling of pages being turned and the occasional whisper. It was a place of discovery, of learning, of imagination.",
  "The ocean stretched out as far as the eye could see, its surface sparkling under the sun. Waves crashed against the shore, leaving behind traces of foam before retreating back. Seagulls cawed overhead, their silhouettes stark against the clear blue sky. The salty air was refreshing, a reminder of the vastness of nature.",
];

const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Speak as if you're a speech therapist. Give consise answers and advice based",
};

function App() {
  const [typing, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message:
        "When you're ready, record yourself reciting this passage: \n" +
        PROMPTS[Math.floor(Math.random() * PROMPTS.length)],
      sender: "Stutstut",
    },
  ]);
  const [restart, setRestart] = useState(false);
  const [output, setOutput] = useState("");
  const handleButtonClick = (value) => {
    setIsTyping(true);
    console.log("value", value);
    setOutput(value);
    const newAdvice = {
      message: output,
      sender: "Stutstut",
    };
    const newAdvices = [...messages, newAdvice];
    setMessages(newAdvices);
    setIsTyping(false);
  };

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };
    const newMessages = [...messages, newMessage]; // all the old messages + the new message

    // update the messages state
    setMessages(newMessages);
    // set typing activity
    setIsTyping(true);

    // process message to chatgpt/cloudflare (send it over and see the response)
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-4",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  const restartFunc = () => {
    setMessages([
      {
        message:
          "When you're ready, record yourself reciting this passage: \n" +
          PROMPTS[Math.floor(Math.random() * PROMPTS.length)],
        sender: "Stutstut",
      },
    ]);
    setRestart(false);
    setIsTyping(false);
  };

  return (
    <div>
      <div>
        {/* <FontAwesomeIcon style={{ fontSize: 80 }} icon={faComments} /> */}
        <img
          src={logo}
          alt="Stutstut Logo"
          style={{ width: "100px", height: "auto" }}
        />
        <h1>Stutstut</h1>
      </div>
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={
                typing ? <TypingIndicator content="Stutstut is typing" /> : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            {/* <div as="MessageInput"> */}
            {/* <MicButton /> */}
            <MessageInput
              placeholder="Type message here"
              onSend={handleSend}
              attachButton={false}
            />
            {/* </div> */}
            <InputToolbox>
              <MicButton onButtonClick={handleButtonClick} />
              <button
                onClick={restartFunc}
                style={{ backgroundColor: "#C9DFF0" }}
              >
                <FontAwesomeIcon icon={faRotate} />
              </button>
            </InputToolbox>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
