import { interval, switchMap } from "rxjs";
import { ajax } from "rxjs/ajax";

import { Message, MessageInterface } from "./Message";

const vault: Message[] = [];
const list: HTMLUListElement | null = document.querySelector("ul");

function app() {
  const fetchUnreadMessages$ = interval(3000).pipe(
    switchMap(() =>
      ajax(
        "https://ahj-rxjs-pooling-server-liaksej.vercel.app/messages/unread",
      ),
    ),
  );

  fetchUnreadMessages$.subscribe((data) => {
    const requestData = data.response as {
      status: "ok";
      timestamp: number;
      messages: MessageInterface[];
    };
    const messages: MessageInterface[] = requestData.messages;
    messages.forEach((message) => {
      const newMessage = new Message(
        message.id,
        message.from,
        message.subject,
        message.body,
        message.received,
      );

      vault.push(newMessage);
      if (list) {
        newMessage.postMessage(list);
      }
    });
  });
}

app();
