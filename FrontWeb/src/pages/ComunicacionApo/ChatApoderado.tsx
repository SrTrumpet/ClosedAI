import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { GET_MESSAGES } from "../../graphql/queries/user";
import { MESSAGE_SUBSCRIPTION } from "../../graphql/mutations/user";
import { SEND_MESSAGE } from "../../graphql/mutations/user";
import NavBar from "../../components/NavBar";

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
  };
  recipient: {
    id: number;
    firstName: string;
    lastName: string;
  };
  timestamp: string;
}

const ChatApoderado: React.FC = () => {
  const location = useLocation();
  const { recipientId: recipientIdFromParams } = useParams();
  const navigate = useNavigate();
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const { state } = location;
  console.log("Estado recibido:", state);

  const senderId = Number(
    state?.senderId || JSON.parse(sessionStorage.getItem("user") || "{}")?.id
  );
  const recipientId = Number(state?.recipientId || recipientIdFromParams);

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const { data, loading, error, refetch } = useQuery(GET_MESSAGES, {
    variables: { senderId, recipientId },
    skip: !senderId || !recipientId,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (error) => console.error("Error en Apollo Client:", error),
  });

  const { data: subscriptionData } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { recipientId: senderId },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);

    return () => clearInterval(interval); 
  }, [refetch]);

  useEffect(() => {
    if (data && data.getMessages) {
      console.log("Mensajes cargados desde la API:", data.getMessages);
      setChatMessages(data.getMessages as Message[]);
    }
  }, [data]);
  

  useEffect(() => {
    if (subscriptionData && subscriptionData.messageSent) {
      const newMessage = subscriptionData.messageSent as Message;
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  }, [subscriptionData]);

  const handleSendMessage = async () => {
    console.log("Datos enviados a la mutación:", {
      content: message,
      senderId,
      recipientId,
    });

    if (message.trim() && senderId && recipientId) {
      try {
        await sendMessage({
          variables: {
            content: message,
            senderId,
            recipientId,
          },
        });
        setMessage("");
        refetch();
      } catch (err) {
        console.error("Error al enviar el mensaje:", err);
      }
    } else {
      console.warn("Datos inválidos. El mensaje no se puede enviar.");
    }
  };

  if (!senderId || !recipientId) {
    return (
      <div className="text-center">
        <p className="text-red-500">Error: Información de usuario no válida.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          Regresar
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (loading) return <p>Cargando mensajes...</p>;
  if (error) return <p>Error al cargar mensajes: {error.message}</p>;

  return (
    <div className="bg-[#DDE5B6] min-h-screen">
      <NavBar />
      <div className="container mx-auto py-12">
        <h1 className="text-5xl font-bold text-[#1B4332] text-center mb-8">
          Chat con Usuario
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
        <div 
          ref={chatBoxRef}
          className="chat-box max-h-96 overflow-y-auto mb-4 flex flex-col gap-4">
          {chatMessages.map((msg) => {
            const senderIdNumeric = Number(senderId);
            const msgSenderId = Number(msg.sender.id);
            const msgRecipientId = Number(msg.recipient.id);

            const isSentByLoggedUser = msgSenderId === senderIdNumeric; 
            const isReceivedByLoggedUser = msgRecipientId === senderIdNumeric; 

            console.log("Procesando mensaje:", {
              messageId: msg.id,
              senderId: msgSenderId,
              recipientId: msgRecipientId,
              isSentByLoggedUser,
              isReceivedByLoggedUser,
            });

            return (
              <div
                key={msg.id}
                className={`p-3 rounded-lg shadow-md max-w-lg ${
                  isSentByLoggedUser
                    ? "bg-[#E3F2FD] text-black ml-auto" 
                    : "bg-[#F5F5F5] text-black mr-auto" 
                }`}>
                <p>{msg.content}</p>
                <small className="block text-xs text-gray-500">
                  {msg.sender.firstName} {msg.sender.lastName} -{" "}
                  {new Date(msg.timestamp).toLocaleString()}
                </small>
              </div>
            );
          })}
        </div>
          <div className="message-input flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none"
             placeholder="Escribe tu mensaje..."/>
            <button
              onClick={handleSendMessage}
              className="bg-[#1B4332] text-white py-3 px-6 rounded-r-lg hover:bg-[#ADC178]">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApoderado;
